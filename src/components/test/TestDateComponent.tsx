/* eslint-disable @typescript-eslint/no-explicit-any */
// components/TestDateComponent.tsx
"use client";
import React from 'react';
import { format, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function TestDateComponent() {
  const dateFromInitialResa = new Date("2025-07-10T00:00:00.000Z"); // Utilisez une date fixe connue
  console.log("TestDateComponent - dateFromInitialResa:", dateFromInitialResa, "isValid:", isValid(dateFromInitialResa));

  const getValidDate = (date: Date | string | null | undefined): Date | null => {
    if (!date) return null;
    if (date instanceof Date && isValid(date)) {
      return date;
    }
    const parsedDate = new Date(date);
    return isValid(parsedDate) ? parsedDate : null;
  };

  const myFormattedDate = getValidDate(dateFromInitialResa);
  console.log("TestDateComponent - myFormattedDate (after getValidDate):", myFormattedDate, "isValid:", myFormattedDate ? isValid(myFormattedDate) : false);

  let formattedString = "Date non formatée";
  try {
    if (myFormattedDate) {
      formattedString = format(myFormattedDate, "PPP", { locale: fr });
    } else {
      formattedString = "Date invalide via getValidDate";
    }
  } catch (error : any) {
    console.error("Error formatting date in TestDateComponent:", error);
    formattedString = `Erreur de formatage: ${error.message}`;
  }

  return (
    <div>
      <h2>Test de Date</h2>
      <p>Date brute : {dateFromInitialResa.toString()}</p>
      <p>Date formatée : {formattedString}</p>
    </div>
  );
}