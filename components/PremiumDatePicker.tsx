"use client";

import React, { useState, useRef, useEffect } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, isBefore, startOfDay } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";

interface PremiumDatePickerProps {
  value: string; // Format: YYYY-MM-DD
  onChange: (date: string) => void;
  minDate?: Date;
}

export default function PremiumDatePicker({ value, onChange, minDate = new Date() }: PremiumDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // The month currently being viewed in the calendar
  const [currentMonth, setCurrentMonth] = useState(value ? new Date(value) : new Date());
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const onDateClick = (day: Date) => {
    // Prevent selecting past dates
    if (isBefore(startOfDay(day), startOfDay(minDate))) return;
    
    // YYYY-MM-DD format for the parent
    const formatted = format(day, "yyyy-MM-dd");
    onChange(formatted);
    setIsOpen(false);
  };

  const renderHeader = () => {
    return (
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <button 
          type="button"
          onClick={prevMonth}
          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-light)", padding: 4, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <ChevronLeft size={18} />
        </button>
        <span style={{ fontWeight: 700, fontSize: 15, color: "var(--color-heading)" }}>
          {format(currentMonth, "MMMM yyyy")}
        </span>
        <button 
          type="button"
          onClick={nextMonth}
          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-light)", padding: 4, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <ChevronRight size={18} />
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const dateFormat = "eeeeee"; // e.g. "Su", "Mo"
    const days = [];
    let startDate = startOfWeek(currentMonth);
    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} style={{ textAlign: "center", fontSize: 12, fontWeight: 600, color: "var(--color-light)", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }
    return <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    const selectedDate = value ? new Date(value + "T12:00:00") : null;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "d");
        const cloneDay = day;
        const isDisabled = isBefore(startOfDay(day), startOfDay(minDate));
        const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
        const isCurrentMonth = isSameMonth(day, monthStart);

        days.push(
          <div
            key={day.toString()}
            onClick={() => !isDisabled && onDateClick(cloneDay)}
            style={{
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              fontWeight: isSelected ? 600 : 500,
              cursor: isDisabled ? "not-allowed" : "pointer",
              borderRadius: "50%",
              color: isDisabled ? "#cbd5e1" : isSelected ? "#fff" : isCurrentMonth ? "var(--color-heading)" : "var(--color-light)",
              background: isSelected ? "#2563EB" : "transparent",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              if (!isDisabled && !isSelected) e.currentTarget.style.background = "#f1f5f9";
            }}
            onMouseLeave={(e) => {
              if (!isDisabled && !isSelected) e.currentTarget.style.background = "transparent";
            }}
          >
            {formattedDate}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  const displayValue = value ? format(new Date(value + "T12:00:00"), "MMM dd, yyyy") : "";

  return (
    <div ref={dropdownRef} style={{ position: "relative" }}>
      {/* Custom Input */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          width: "100%",
          padding: "12px 14px",
          border: `1.5px solid ${isOpen ? "#2563EB" : "#e2e8f0"}`,
          borderRadius: 10,
          background: "var(--color-bg-card)",
          cursor: "pointer",
          transition: "all 0.2s ease",
          boxShadow: isOpen ? "0 0 0 3px rgba(37, 99, 235, 0.1)" : "none",
        }}
      >
        <CalendarIcon size={18} style={{ color: isOpen ? "#2563EB" : "var(--color-light)", transition: "color 0.2s" }} />
        <span style={{ fontSize: 14, color: displayValue ? "var(--color-heading)" : "var(--color-light)", fontWeight: 500, flex: 1 }}>
          {displayValue || "Select a date..."}
        </span>
      </div>

      {/* Dropdown Calendar */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            zIndex: 50,
            background: "var(--color-bg-card)",
            border: "1px solid #e2e8f0",
            borderRadius: 16,
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
            padding: 20,
            width: 320,
            animation: "calendarPop 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
            transformOrigin: "top left",
          }}
        >
          {renderHeader()}
          {renderDays()}
          {renderCells()}
        </div>
      )}
      
      <style>{`
        @keyframes calendarPop {
          from { opacity: 0; transform: scale(0.95) translateY(-10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
