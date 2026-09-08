import auth_service


def test_login_with_seeded_user():
    user = auth_service.authenticate_user('admin', 'admin123')
    assert user == {'success': True, 'username': 'admin', 'role': 'admin'}


def test_login_with_wrong_password():
    user = auth_service.authenticate_user('admin', 'wrong-password')
    assert user['success'] is False


def test_unknown_user():
    user = auth_service.authenticate_user('missing', 'admin123')
    assert user == {'success': False, 'message': 'Usuario no encontrado'}
