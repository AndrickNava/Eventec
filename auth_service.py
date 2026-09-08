import hashlib


_users = {
    "admin": {
        "username": "admin",
        "password_hash": hashlib.sha256(b"admin123").hexdigest(),
        "role": "admin",
    }
}


def init_db():
    return None


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


def authenticate_user(username: str, password: str):
    user = _users.get(username)
    if not user:
        return {"success": False, "message": "Usuario no encontrado"}

    if hash_password(password) != user["password_hash"]:
        return {"success": False, "message": "Contraseña incorrecta"}

    return {"success": True, "username": user["username"], "role": user["role"]}
