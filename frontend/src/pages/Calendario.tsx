import { useEffect, useMemo, useState } from "react";
import FullCalendar from "@fullcalendar/react";

import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import ptBr from "@fullcalendar/core/locales/pt-br";

import { api } from "../services/api";

import toast from "react-hot-toast";

import type { Agendamento, Barbeiro } from "../types";

export default function Calendario() {

  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);

  const [barbeiros, setBarbeiros] = useState<Barbeiro[]>([]);

  const [barbeiroFiltro, setBarbeiroFiltro] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    carregarDados();

  }, []);

  const carregarDados = async () => {

    try {

      const [agendamentosRes, barbeirosRes] = await Promise.all([
        api.get("agendamentos/"),
        api.get("barbeiros/")
      ]);

      setAgendamentos(agendamentosRes.data);

      setBarbeiros(barbeirosRes.data);

    } catch {

      toast.error("Erro ao carregar calendário");

    } finally {

      setLoading(false);
    }
  };

  // FILTRO POR BARBEIRO
  const agendamentosFiltrados = useMemo(() => {

    if (!barbeiroFiltro) {

      return agendamentos;
    }

    return agendamentos.filter(
      a => String(a.barbeiro) === barbeiroFiltro
    );

  }, [agendamentos, barbeiroFiltro]);

  // EVENTOS
  const eventos = agendamentosFiltrados.map(a => ({

    id: String(a.id),

    title: `${a.cliente_nome} - ${a.servico_nome}`,

    start: a.dataHora,

    extendedProps: {
      barbeiro: a.barbeiro_nome,
      servico: a.servico_nome
    }
  }));

  return (

    <div className="min-h-screen bg-[#020617] text-white p-3 md:p-8">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <div>

          <h1 className="text-3xl md:text-4xl font-bold">
            📅 Calendário
          </h1>

          <p className="text-gray-400 mt-2 text-sm md:text-base">
            Agenda completa da barbearia
          </p>

        </div>

        {/* FILTRO */}
        <div className="w-full md:w-72">

          <select
            value={barbeiroFiltro}
            onChange={(e) => setBarbeiroFiltro(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 outline-none"
          >

            <option value="" className="text-black">
              Todos os barbeiros
            </option>

            {barbeiros.map(barbeiro => (

              <option
                key={barbeiro.id}
                value={barbeiro.id}
                className="text-black"
              >
                {barbeiro.nome}
              </option>

            ))}

          </select>

        </div>

      </div>

      {/* CARD CALENDÁRIO */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-2 md:p-6 overflow-hidden">

        {loading ? (

          <div className="flex justify-center items-center h-[400px]">

            <div className="animate-spin h-10 w-10 border-4 border-green-500 border-t-transparent rounded-full"></div>

          </div>

        ) : (

          <div className="w-full overflow-x-auto">

            <div className="min-w-[320px]">

              <FullCalendar
                plugins={[
                  dayGridPlugin,
                  timeGridPlugin,
                  interactionPlugin
                ]}

                initialView={
                  window.innerWidth < 768
                    ? "timeGridDay"
                    : "timeGridWeek"
                }

                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right:
                    window.innerWidth < 768
                      ? "timeGridDay"
                      : "dayGridMonth,timeGridWeek,timeGridDay"
                }}

                locale={ptBr}

                events={eventos}

                height="auto"

                slotMinTime="08:00:00"

                slotMaxTime="22:00:00"

                allDaySlot={false}

                expandRows={true}

                eventClick={(info) => {

                  toast.success(
                    `${info.event.title} | ${info.event.extendedProps.barbeiro}`
                  );
                }}

                eventContent={(eventInfo) => (

                  <div className="p-1 md:p-2 overflow-hidden">

                    <p className="font-bold text-[10px] md:text-xs truncate">
                      {eventInfo.event.title}
                    </p>

                    <p className="text-[9px] md:text-[11px] opacity-80 truncate">
                      {eventInfo.event.extendedProps.barbeiro}
                    </p>

                  </div>

                )}
              />

            </div>

          </div>

        )}

      </div>

    </div>
  );
}