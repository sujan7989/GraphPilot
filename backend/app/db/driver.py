from neo4j import GraphDatabase
from app.config import get_settings
import logging

logger = logging.getLogger(__name__)

class Neo4jDriver:
    def __init__(self):
        settings = get_settings()
        self._driver = None
        self._uri = settings.cognodb_uri
        self._username = settings.cognodb_username
        self._password = settings.cognodb_password
    
    def connect(self):
        try:
            self._driver = GraphDatabase.driver(
                self._uri,
                auth=(self._username, self._password)
            )
            # Verify connection
            self._driver.verify_connectivity()
            logger.info("Successfully connected to CognoDB")
            return True
        except Exception as e:
            logger.error(f"Failed to connect to CognoDB: {e}")
            return False
    
    def close(self):
        if self._driver:
            self._driver.close()
            logger.info("Closed CognoDB connection")
    
    def session(self):
        if not self._driver:
            raise RuntimeError("Driver not initialized. Call connect() first.")
        return self._driver.session()
    
    def execute_query(self, query, parameters=None):
        with self.session() as session:
            result = session.run(query, parameters or {})
            return [record for record in result]


# Global driver instance
_driver_instance = None

def get_driver():
    global _driver_instance
    if _driver_instance is None:
        _driver_instance = Neo4jDriver()
        if not _driver_instance.connect():
            raise RuntimeError("Failed to connect to CognoDB")
    return _driver_instance
