import { Request, Response } from 'express';
import { Appointment } from '../models/appointment.model';
import { parseISO, startOfDay, endOfDay } from 'date-fns';

export const createAppointment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { veterinarianId, date, time } = req.body;

    // Converte a data para o início do dia (00:00:00)
    const appointmentDate = startOfDay(parseISO(date));
    const dayEnd = endOfDay(appointmentDate);

    // Verifica se já existe um agendamento para o mesmo veterinário, data e hora
    const existingAppointment = await Appointment.findOne({
      veterinarianId,
      date: {
        $gte: appointmentDate,
        $lt: dayEnd
      },
      time,
      status: { $ne: 'cancelled' } // Ignora agendamentos cancelados
    });

    if (existingAppointment) {
      res.status(400).json({ 
        message: 'Este horário já está reservado. Por favor, escolha outro horário.' 
      });
      return;
    }

    // Cria o novo agendamento com a data ajustada
    const appointment = new Appointment({
      ...req.body,
      date: appointmentDate
    });
    await appointment.save();
    res.status(201).json(appointment);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Erro ao criar agendamento' });
  }
};

export const getAppointments = async (_req: Request, res: Response): Promise<void> => {
  try {
    const appointments = await Appointment.find()
      .populate('veterinarianId')
      .populate('serviceId')
      .sort({ date: 1 });
    res.json(appointments);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Erro ao buscar agendamentos' });
  }
};

export const getAppointmentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('veterinarianId');
    if (!appointment) {
      res.status(404).json({ message: 'Agendamento não encontrado' });
      return;
    }
    res.json(appointment);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Erro ao buscar agendamento' });
  }
};

export const updateAppointment = async (req: Request, res: Response): Promise<void> => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    .populate('veterinarianId')
    .populate('serviceId');
    
    if (!appointment) {
      res.status(404).json({ message: 'Agendamento não encontrado' });
      return;
    }
    res.json(appointment);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Erro ao atualizar agendamento' });
  }
};

export const deleteAppointment = async (req: Request, res: Response): Promise<void> => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      res.status(404).json({ message: 'Agendamento não encontrado' });
      return;
    }
    res.status(200).json({ message: 'Agendamento removido com sucesso' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Erro ao remover agendamento' });
  }
};

export const getAvailableHours = async (req: Request, res: Response): Promise<void> => {
  try {
    const { veterinarianId, date } = req.query;

    if (!veterinarianId || !date) {
      res.status(400).json({ message: 'Veterinário e data são obrigatórios' });
      return;
    }

    // Converte a data para o início do dia (00:00:00)
    const searchDate = startOfDay(parseISO(date as string));
    const dayEnd = endOfDay(searchDate);

    // Horários padrão de funcionamento
    const workingHours = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
    ];

    // Busca os agendamentos existentes para o veterinário na data selecionada
    const appointments = await Appointment.find({
      veterinarianId,
      date: {
        $gte: searchDate,
        $lt: dayEnd
      },
      status: { $ne: 'cancelled' } // Ignora agendamentos cancelados
    });

    // Remove os horários que já estão agendados
    const bookedHours = appointments.map(appointment => appointment.time);
    const availableHours = workingHours.filter(hour => !bookedHours.includes(hour));

    // Filtra horários passados se a data for hoje
    const today = new Date();
    const selectedDate = parseISO(date as string);
    
    if (startOfDay(selectedDate).getTime() === startOfDay(today).getTime()) {
      const currentHour = today.getHours();
      const currentMinutes = today.getMinutes();
      
      const filteredHours = availableHours.filter(hour => {
        const [hourStr, minuteStr] = hour.split(':');
        const appointmentHour = parseInt(hourStr);
        const appointmentMinute = parseInt(minuteStr);
        
        // Compara se o horário já passou
        if (appointmentHour < currentHour || 
           (appointmentHour === currentHour && appointmentMinute <= currentMinutes)) {
          return false;
        }
        return true;
      });

      res.json(filteredHours);
      return;
    }

    res.json(availableHours);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Erro ao buscar horários disponíveis' });
  }
};
