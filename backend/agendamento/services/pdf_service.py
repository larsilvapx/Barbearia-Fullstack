from reportlab.pdfgen import canvas
from django.http import HttpResponse


def gerar_relatorio_pdf(agendamentos):

    response = HttpResponse(content_type='application/pdf')

    response['Content-Disposition'] = (
        'attachment; filename="relatorio_agendamentos.pdf"'
    )

    pdf = canvas.Canvas(response)

    pdf.setTitle("Relatório de Agendamentos")

    pdf.drawString(200, 800, "RELATÓRIO DE AGENDAMENTOS")

    y = 760

    for agendamento in agendamentos:

        texto = (
            f"Cliente: {agendamento.cliente.nome} | "
            f"Barbeiro: {agendamento.barbeiro.nome} | "
            f"Serviço: {agendamento.servico.nome} | "
            f"Data: {agendamento.data_hora}"
        )

        pdf.drawString(40, y, texto)

        y -= 30

        if y < 50:
            pdf.showPage()
            y = 800

    pdf.save()

    return response