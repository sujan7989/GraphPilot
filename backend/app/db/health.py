from app.db.driver import get_driver


def check_database_health():
    try:
        driver = get_driver()
        with driver.session() as session:
            result = session.run("RETURN 1 as test")
            result.single()
            return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "database": "disconnected", "error": str(e)}
