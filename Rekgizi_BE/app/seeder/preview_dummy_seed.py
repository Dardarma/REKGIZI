from app.seeder.Diagnosa_seed import seed_diagnosa
from app.seeder.article import seed_article
from app.seeder.dataset_pasien_seed import seed_dataset_pasien
from app.seeder.production_dummy_seed import seed_production_dummy
from app.seeder.user_seed import seed_users


def seed_preview_dummy() -> None:
    """Seeder lengkap untuk melihat fitur aplikasi dengan data simulasi."""
    print("[1/5] Menyiapkan data production dummy...")
    seed_production_dummy()
    print("[2/5] Menyiapkan user preview...")
    seed_users()
    print("[3/5] Menyiapkan master diagnosis...")
    seed_diagnosa()
    print("[4/5] Menyiapkan artikel preview...")
    seed_article()
    print("[5/5] Menyiapkan pasien dataset dan rekam medis...")
    seed_dataset_pasien()
    print("Seeder dummy preview selesai.")


if __name__ == "__main__":
    seed_preview_dummy()
