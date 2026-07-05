from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.article import Article
from app.models.users import User
from app.seeder.user_seed import seed_users


def seed_article():
    db: Session = SessionLocal()

    try:
        required_author_emails = {
            "admin@example.com",
            "user@example.com",
            "ahligizi@example.com",
        }
        existing_author_emails = {
            email
            for (email,) in db.query(User.email)
            .filter(User.email.in_(required_author_emails))
            .all()
        }
        if existing_author_emails != required_author_emails:
            db.close()
            seed_users()
            db = SessionLocal()

        authors = {
            user.email: user
            for user in db.query(User)
            .filter(User.email.in_(required_author_emails))
            .all()
        }

        data_articles = [
            {
                "author_email": "admin@example.com",
                "judul": "Pengenalan Penyakit Ginjal Kronis (PGK)",
                "konten": "Penyakit Ginjal Kronis (PGK) adalah kondisi penurunan fungsi ginjal secara bertahap dalam jangka waktu lama. PGK sering tidak menunjukkan gejala di tahap awal sehingga penting untuk melakukan pemeriksaan rutin.",
                "is_published": True
            },
            {
                "author_email": "admin@example.com",
                "judul": "Gejala Awal PGK yang Sering Diabaikan",
                "konten": "Gejala awal PGK meliputi kelelahan, pembengkakan pada kaki, perubahan frekuensi buang air kecil, dan tekanan darah tinggi. Banyak pasien tidak menyadari kondisi ini hingga memasuki tahap lanjut.",
                "is_published": True
            },
            {
                "author_email": "user@example.com",
                "judul": "Pola Makan untuk Pasien PGK",
                "konten": "Pasien PGK disarankan mengurangi asupan natrium, fosfor, dan protein berlebih. Konsumsi makanan segar seperti sayuran rendah kalium sangat dianjurkan untuk menjaga fungsi ginjal.",
                "is_published": True
            },
            {
                "author_email": "user@example.com",
                "judul": "Peran Dialisis pada PGK Stadium Akhir",
                "konten": "Dialisis diperlukan ketika fungsi ginjal sudah sangat menurun. Proses ini membantu menyaring limbah dan cairan berlebih dari tubuh yang tidak dapat lagi dilakukan oleh ginjal.",
                "is_published": True
            },
            {
                "author_email": "ahligizi@example.com",
                "judul": "Pencegahan Penyakit Ginjal Kronis",
                "konten": "Pencegahan PGK dapat dilakukan dengan menjaga tekanan darah, mengontrol gula darah, menghindari konsumsi obat sembarangan, dan menerapkan gaya hidup sehat.",
                "is_published": False
            },
            {
                "author_email": "ahligizi@example.com",
                "judul": "Hubungan Diabetes dengan PGK",
                "konten": "Diabetes merupakan salah satu penyebab utama PGK. Kadar gula darah yang tidak terkontrol dapat merusak pembuluh darah kecil di ginjal.",
                "is_published": True
            },
            {
                "author_email": "admin@example.com",
                "judul": "Pentingnya Pemeriksaan Rutin Ginjal",
                "konten": "Pemeriksaan rutin seperti cek kreatinin dan laju filtrasi glomerulus (GFR) penting untuk mendeteksi PGK sejak dini.",
                "is_published": False
            },
            {
                "author_email": "user@example.com",
                "judul": "Komplikasi yang Dapat Terjadi pada PGK",
                "konten": "PGK dapat menyebabkan komplikasi seperti anemia, gangguan tulang, hingga penyakit kardiovaskular jika tidak ditangani dengan baik.",
                "is_published": True
            }
        ]

        for item in data_articles:
            existing = db.query(Article).filter_by(judul=item["judul"]).first()
            author = authors[item.pop("author_email")]
            item["user_id"] = author.id

            if not existing:
                db.add(Article(**item))
            else:
                for key, value in item.items():
                    setattr(existing, key, value)
                existing.deleted_at = None

        db.commit()
        print("Seeder article PGK berhasil dijalankan")

    except Exception as e:
        db.rollback()
        print("Seeder gagal:", e)

    finally:
        db.close()


if __name__ == "__main__":
    seed_article()
