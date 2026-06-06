from rest_framework import viewsets
from rest_framework.decorators import action
from django.http import HttpResponse
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle
)
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet

from .models import Agendamento

from .models import (
    Cliente,
    Barbeiro,
    Servico,
    Agendamento
)

from .serializers import (
    ClienteSerializer,
    BarbeiroSerializer,
    ServicoSerializer,
    AgendamentoSerializer
)

from .services.pdf_service import gerar_relatorio_pdf


class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer


class BarbeiroViewSet(viewsets.ModelViewSet):
    queryset = Barbeiro.objects.all()
    serializer_class = BarbeiroSerializer


class ServicoViewSet(viewsets.ModelViewSet):
    queryset = Servico.objects.all()
    serializer_class = ServicoSerializer


class AgendamentoViewSet(viewsets.ModelViewSet):

    queryset = Agendamento.objects.all()
    serializer_class = AgendamentoSerializer

    @action(detail=False, methods=["get"])
    def relatorio_pdf(self, request):

        agendamentos = Agendamento.objects.all()

        return gerar_relatorio_pdf(agendamentos)
    
from io import BytesIO

def gerar_relatorio_pdf(request):

    buffer = BytesIO()

    pdf = SimpleDocTemplate(buffer)

    styles = getSampleStyleSheet()

    elementos = []

    titulo = Paragraph(
        "Relatório de Agendamentos",
        styles["Title"]
    )

    elementos.append(titulo)
    elementos.append(Spacer(1, 20))

    agendamentos = Agendamento.objects.all()

    dados = [
        [
            "Cliente",
            "Barbeiro",
            "Serviço",
            "Data"
        ]
    ]

    for item in agendamentos:

        dados.append([
            item.cliente.nome,
            item.barbeiro.nome,
            item.servico.nome,
            item.data_hora if item.data_hora else "-"
        ])

    tabela = Table(dados)

    tabela.setStyle(
        TableStyle([
            ("BACKGROUND", (0,0), (-1,0), colors.black),
            ("TEXTCOLOR", (0,0), (-1,0), colors.white),
            ("GRID", (0,0), (-1,-1), 1, colors.black),
        ])
    )

    elementos.append(tabela)

    pdf.build(elementos)

    buffer.seek(0)

    response = HttpResponse(
        buffer,
        content_type="application/pdf"
    )

    response[
        "Content-Disposition"
    ] = 'attachment; filename="relatorio.pdf"'

    return response    