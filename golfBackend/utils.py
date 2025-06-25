from models import UserModel
def get_all_admin_mails():
    admins = UserModel.query.filter_by(role ="admin").all()
    return[admin.email for admin in admins]
