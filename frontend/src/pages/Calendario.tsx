import { useEffect, useMemo, useState } from "react";

import FullCalendar from "@fullcalendar/react";

import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import ptBr from "@fullcalendar/core/locales/pt-br";

import type {
  EventClickArg,
  EventDropArg,
  EventApi
} from "@fullcalendar/core";

import { api } from "../services/api";

import toast from "react-hot-toast";

import Modal from "../components/Modal";

import type { Agendamento } from "../types";

type Evento = {
  id: number;

  title: string;

  start: string;

  backgroundColor: string;

  borderColor: string;

  cliente_nome: string;

  barbeiro_nome: string;

  servico_nome: string;
};

export default function Calendario() {

  const [eventos, setEventos] =
    useState<Evento[]>([]);

  const [openModal, setOpenModal] =
    useState(false);

  const [
    eventoSelecionado,
    setEventoSelecionado
  ] = useState<EventApi | null>(null);

  const [
    barbeiroFiltro,
    setBarbeiroFiltro
  ] = useState("todos");

  // CORES DOS SERVIÇOS
  const getColor = (
    servico: string
  ) => {

    const nome =
      servico.toLowerCase();

    if (nome.includes("corte"))
      return "#3b82f6";

    if (nome.includes("barba"))
      return "#22c55e";

    if (nome.includes("pigment"))
      return "#a855f7";

    return "#f59e0b";
  };

  // CARREGAR EVENTOS
  const carregarEventos =
    async () => {

      try {

        const response =
          await api.get(
            "agendamentos/"
          );

        const eventosFormatados =
          response.data.map(
            (a: Agendamento) => {

              const color =
                getColor(
                  a.servico_nome
                );

              return {

                id: a.id,

                title:
                  `${a.cliente_nome} - ${a.servico_nome}`,

                start:
                  a.dataHora,

                backgroundColor:
                  color,

                borderColor:
                  color,

                cliente_nome:
                  a.cliente_nome,

                barbeiro_nome:
                  a.barbeiro_nome,

                servico_nome:
                  a.servico_nome
              };
            }
          );

        setEventos(
          eventosFormatados
        );

      } catch {

        toast.error(
          "Erro ao carregar calendário"
        );
      }
    };

  useEffect(() => {

    carregarEventos();

  }, []);

  // CLICK EVENTO
  const handleEventClick = (
    info: EventClickArg
  ) => {

    setEventoSelecionado(
      info.event
    );

    setOpenModal(true);
  };

  // DRAG AND DROP
  const handleEventDrop =
    async (
      info: EventDropArg
    ) => {

      try {

        await api.patch(
          `agendamentos/${info.event.id}/`,
          {
            dataHora:
              info.event.start
          }
        );

        toast.success(
          "Horário atualizado!"
        );

      } catch {

        toast.error(
          "Erro ao mover agendamento"
        );

        info.revert();
      }
    };

  // FILTRO BARBEIRO
  const barbeiros =
    useMemo(() => {

      const nomes =
        eventos.map(
          e => e.barbeiro_nome
        );

      return [
        ...new Set(nomes)
      ];

    }, [eventos]);

  const eventosFiltrados =
    useMemo(() => {

      if (
        barbeiroFiltro ===
        "todos"
      ) {
        return eventos;
      }

      return eventos.filter(
        e =>
          e.barbeiro_nome ===
          barbeiroFiltro
      );

    }, [
      eventos,
      barbeiroFiltro
    ]);

  return (

    <div className="min-h-screen bg-[#020617] text-white p-8">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">

        <div>

          <h1 className="text-4xl font-bold mb-2">
            📅 Agenda Visual
          </h1>

          <p className="text-gray-400">
            Calendário profissional da barbearia
          </p>

        </div>

        {/* FILTRO */}
        <select
          value={barbeiroFiltro}
          onChange={(e) =>
            setBarbeiroFiltro(
              e.target.value
            )
          }
          className="bg-white/10 border border-white/10 rounded-2xl px-4 py-3"
        >

          <option value="todos">
            Todos barbeiros
          </option>

          {barbeiros.map(
            nome => (

              <option
                key={nome}
                value={nome}
                className="text-black"
              >
                {nome}
              </option>

            )
          )}

        </select>

      </div>

      {/* LEGENDA */}
      <div className="flex gap-4 mb-6 flex-wrap">

        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-blue-500"></div>
          <span>Corte</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-500"></div>
          <span>Barba</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-purple-500"></div>
          <span>Pigmentação</span>
        </div>

      </div>

      {/* CALENDÁRIO */}
      <div className="bg-white rounded-3xl p-6 shadow-2xl">

        <FullCalendar
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            interactionPlugin
          ]}

          initialView="timeGridWeek"

          locale={ptBr}

          editable={true}

          selectable={true}

          events={eventosFiltrados}

          eventClick={
            handleEventClick
          }

          eventDrop={
            handleEventDrop
          }

          height="80vh"

          slotMinTime="08:00:00"

          slotMaxTime="22:00:00"

          allDaySlot={false}

          nowIndicator={true}

          headerToolbar={{
            left:
              "prev,next today",

            center:
              "title",

            right:
              "dayGridMonth,timeGridWeek,timeGridDay"
          }}

          buttonText={{
            today: "Hoje",

            month: "Mês",

            week: "Semana",

            day: "Dia"
          }}
        />

      </div>

      {/* MODAL EVENTO */}
      <Modal
        open={openModal}
        onClose={() =>
          setOpenModal(false)
        }
      >

        <h2 className="text-3xl font-bold mb-6">
          ✂️ Agendamento
        </h2>

        {eventoSelecionado && (

          <div className="space-y-4">

            <div>

              <p className="text-gray-400">
                Cliente
              </p>

              <h3 className="text-xl font-bold">
                {
                  eventoSelecionado
                    .extendedProps
                    .cliente_nome
                }
              </h3>

            </div>

            <div>

              <p className="text-gray-400">
                Barbeiro
              </p>

              <h3 className="text-xl font-bold">
                {
                  eventoSelecionado
                    .extendedProps
                    .barbeiro_nome
                }
              </h3>

            </div>

            <div>

              <p className="text-gray-400">
                Serviço
              </p>

              <h3 className="text-xl font-bold">
                {
                  eventoSelecionado
                    .extendedProps
                    .servico_nome
                }
              </h3>

            </div>

            <div>

              <p className="text-gray-400">
                Horário
              </p>

              <h3 className="text-xl font-bold">

                {eventoSelecionado.start &&
                  new Date(
                    eventoSelecionado.start
                  ).toLocaleString(
                    "pt-BR"
                  )}

              </h3>

            </div>

          </div>

        )}

      </Modal>

    </div>
  );
}