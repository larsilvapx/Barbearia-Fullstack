from rest_framework import serializers
from .models import Cliente, Barbeiro, Servico, Agendamento


class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = "__all__"


class BarbeiroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Barbeiro
        fields = "__all__"


class ServicoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Servico
        fields = "__all__"


class AgendamentoSerializer(serializers.ModelSerializer):

    cliente_nome = serializers.CharField(
        source="cliente.nome",
        read_only=True
    )

    barbeiro_nome = serializers.CharField(
        source="barbeiro.nome",
        read_only=True
    )

    servico_nome = serializers.CharField(
        source="servico.nome",
        read_only=True
    )

    servico_preco = serializers.DecimalField(
        source="servico.preco",
        max_digits=6,
        decimal_places=2,
        read_only=True
    )

    barbeiro_comissao = serializers.IntegerField(
        source="barbeiro.percentual_comissao",
        read_only=True
    )

    dataHora = serializers.DateTimeField(
        source="data_hora"
    )

    class Meta:
        model = Agendamento

        fields = [
            "id",
            "cliente",
            "barbeiro",
            "servico",

            "cliente_nome",
            "barbeiro_nome",
            "servico_nome",

            "servico_preco",
            "barbeiro_comissao",

            "dataHora",
            "status"
        ]
        extra_kwargs = {
            "status": {
                "required": False
            }
        }