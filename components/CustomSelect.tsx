"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface CustomSelectProps {
  options: string[];
  value: string;
  onChange?: (val: string) => void;
  placeholder?: string;
  className?: string;
}

export default function CustomSelect({ options, value: initialValue, onChange, placeholder, className = "" }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(initialValue);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: string) => {
    setSelectedValue(option);
    if (onChange) onChange(option);
    setIsOpen(false);
  };

  const displayValue = selectedValue || placeholder;

  return (
    <div ref={containerRef} className={`custom-select-container ${className}`} style={{ position: "relative", minWidth: 160 }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="custom-select-button"
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 16px",
          background: "#fff",
          border: isOpen ? "1px solid #3C50E0" : "1px solid #e2e8f0",
          borderRadius: "10px",
          fontSize: "14px",
          color: selectedValue ? "#0f172a" : "#94a3b8",
          cursor: "pointer",
          transition: "all 0.2s ease",
          boxShadow: isOpen ? "0 0 0 3px rgba(37,99,235,0.1)" : "0 2px 4px rgba(0,0,0,0.02)",
          outline: "none",
        }}
      >
        <span style={{ fontWeight: 500 }}>{displayValue}</span>
        <ChevronDown 
          style={{ 
            width: 16, height: 16, color: "#64748b", 
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", 
            transition: "transform 0.2s" 
          }} 
        />
      </button>

      {isOpen && (
        <div 
          className="custom-select-dropdown"
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            right: 0,
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            boxShadow: "0 10px 25px rgba(15,23,42,0.1)",
            padding: "8px",
            zIndex: 50,
            animation: "fadeIn 0.15s ease-out forwards",
          }}
        >
          {options.map((opt, i) => (
            <div
              key={i}
              onClick={() => handleSelect(opt)}
              style={{
                padding: "10px 12px",
                fontSize: "14px",
                color: selectedValue === opt ? "#3C50E0" : "#475569",
                background: selectedValue === opt ? "#F0F9FF" : "transparent",
                fontWeight: selectedValue === opt ? 600 : 400,
                borderRadius: "8px",
                cursor: "pointer",
                transition: "background 0.15s, color 0.15s",
              }}
              onMouseEnter={(e) => {
                if (selectedValue !== opt) {
                  e.currentTarget.style.background = "#F8FAFC";
                  e.currentTarget.style.color = "#0f172a";
                }
              }}
              onMouseLeave={(e) => {
                if (selectedValue !== opt) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#475569";
                }
              }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
