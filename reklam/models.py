from django.db import models
from django.core.exceptions import ValidationError

def validate_webm(value):
    if not value.name.lower().endswith('.webm'):
        raise ValidationError("Sadece .webm dosyaları yüklenebilir.")

def reklam_dosya_yolu(instance, filename):
    return f"reklamlar/{instance.id or 'yeni'}/{filename}"

class Reklam(models.Model):
    baslik = models.CharField("Başlık", max_length=120)
    aciklama = models.TextField("Açıklama", blank=True)
    video = models.FileField(
        "Video (WEBM)",
        upload_to=reklam_dosya_yolu,
        blank=True,
        null=True,
        validators=[validate_webm],
    )
    tiklama_url = models.URLField("Tıklama URL")
    aktif = models.BooleanField("Aktif mi?", default=True)
    olusturulma_tarihi = models.DateTimeField("Oluşturulma Tarihi", auto_now_add=True)

    def as_dict(self):
        return {
            "id": self.id,
            "baslik": self.baslik,
            "aciklama": self.aciklama,
            "video": self.video.url if self.video else None,
            "tiklama_url": self.tiklama_url,
        }

    def __str__(self):
        return self.baslik
