from rest_framework.routers import DefaultRouter
from .views import (
    ClienteViewSet,
    BarbeiroViewSet,
    ServicoViewSet,
    AgendamentoViewSet
)
from rest_framework.decorators import action
from django.http import FileResponse


router = DefaultRouter()

router.register(r'clientes', ClienteViewSet)
router.register(r'barbeiros', BarbeiroViewSet)
router.register(r'servicos', ServicoViewSet)
router.register(r'agendamentos', AgendamentoViewSet)

urlpatterns = router.urls