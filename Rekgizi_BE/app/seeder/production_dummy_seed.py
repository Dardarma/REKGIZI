from datetime import date

from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.core.security import hash_password
from app.models.users import KelaminEnum, RoleEnum, User
from app.seeder.intervensi_seed import seed_intervensi
from app.seeder.opsi_parameter_seed import seed_opsi_parameter
from app.seeder.parameter_seed import seed_parameter


DEFAULT_PASSWORD = "password"


def seed_production_users() -> None:
    db: Session = SessionLocal()

    users = [
        {
            "nama": "Admin Rekgizi",
            "email": "admin@example.com",
            "role": RoleEnum.admin,
            "jenis_kelamin": KelaminEnum.pria,
            "tanggal_lahir": date(1990, 1, 1),
        },
        {
            "nama": "Ahli Gizi Rekgizi",
            "email": "ahligizi@example.com",
            "role": RoleEnum.ahli_gizi,
            "jenis_kelamin": KelaminEnum.wanita,
            "tanggal_lahir": date(1992, 6, 15),
        },
    ]

    try:
        password_hash = hash_password(DEFAULT_PASSWORD)

        for item in users:
            user = db.query(User).filter(User.email == item["email"]).first()
            payload = {
                **item,
                "pass_hash": password_hash,
                "alamat": {
                    "desa": "Data awal",
                    "kecamatan": "Data awal",
                    "kota": "Data awal",
                    "provinsi": "Data awal",
                    "lengkap": "Alamat data awal Rekgizi",
                },
            }

            if user is None:
                db.add(User(**payload))
                continue

            for key, value in payload.items():
                setattr(user, key, value)
            user.deleted_at = None

        db.commit()
        print("Seeder user production berhasil dijalankan")
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def seed_production_dummy() -> None:
    """Seeder minimal untuk data awal production/demo terbatas."""
    print("[1/4] Menyiapkan master parameter...")
    seed_parameter()
    print("[2/4] Menyiapkan opsi parameter...")
    seed_opsi_parameter()
    print("[3/4] Menyiapkan master intervensi...")
    seed_intervensi()
    print("[4/4] Menyiapkan user admin dan ahli gizi...")
    seed_production_users()
    print("Seeder dummy production selesai.")


if __name__ == "__main__":
    seed_production_dummy()
