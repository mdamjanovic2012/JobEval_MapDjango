from .fusion_wrapper import FusionWrapper
from django.conf import settings


fw = FusionWrapper(
    credentials=settings.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS_JSON,
    tableId=settings.GOOGLE_FUSIONTABLE_ID)
