// eslint-disable-next-line @typescript-eslint/no-unused-vars
import react from "react"
import axion from "axios"



const APIURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const getBookings = async (params) => {
  try {
    const response = await axion.get(`${APIURL}/reservation`, { params });
    console.log("Bookings fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }
}

export const createBooking = async (bookingData) => {
  try {
    const response = await axion.post(`${APIURL}/reservation`, bookingData);
    console.log("Booking created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
}

export const updateBooking = async (bookingId, bookingData) => {
  try {
    const response = await axion.put(`${APIURL}/reservation/${bookingId}`, bookingData);
    console.log("Booking updated successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating booking:", error);
    throw error;
  }
}

export const deleteBooking = async (bookingId) => {
  try {
    const response = await axion.delete(`${APIURL}/reservation/${bookingId}`);
    console.log("Booking deleted successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error deleting booking:", error);
    throw error;
  }
}
