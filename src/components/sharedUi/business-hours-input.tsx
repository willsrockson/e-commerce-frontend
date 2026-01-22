"use client";
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const formatTime = (time: string) => {
  if (!time) return "";
  const [hour] = time.split(":");
  const h = parseInt(hour, 10);
  const ampm = h >= 12 ? "pm" : "am";
  const formattedHour = h % 12 || 12;
  return `${formattedHour}${ampm}`;
};

const parseTimeBack = (timeStr: string) => {
  if (!timeStr) return "08:00"; // Default fallback
  
  const match = timeStr.match(/(\d+)(am|pm)/i);
  if (!match) return "08:00";

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, hStr, ampm] = match;
  let h = parseInt(hStr, 10);

  if (ampm.toLowerCase() === "pm" && h !== 12) h += 12;
  if (ampm.toLowerCase() === "am" && h === 12) h = 0;

  return `${h.toString().padStart(2, "0")}:00`;
};

export default function BusinessHoursInput({ 
  onChange,
  initialData 
}: { 
  onChange: (value: string) => void,
  initialData?: string 
}) {
  const [startDay, setStartDay] = useState("");
  const [endDay, setEndDay] = useState("");
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("00:00");

  useEffect(() => {
    if (initialData) {

      const regex = /^([A-Za-z]{3})(?:\s*-\s*([A-Za-z]{3}))?\s*\((.+?)\s*-\s*(.+?)\)$/;
      const match = initialData.match(regex);

      if (match) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, sDay, eDay, sTime, eTime] = match;
        
        setStartDay(sDay);
        setEndDay(eDay || sDay); 
        setStartTime(parseTimeBack(sTime));
        setEndTime(parseTimeBack(eTime));
      }
    }
  }, [initialData]);

  useEffect(() => {
    const timeStr = `(${formatTime(startTime)} - ${formatTime(endTime)})`;
    const dayStr = startDay === endDay ? startDay : `${startDay} - ${endDay}`;
    const finalString = `${dayStr} ${timeStr}`;
    
    onChange(finalString);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDay, endDay, startTime, endTime]);

  return (
    <div className="space-y-3">
      <Label className="text-gray-600 font-medium">Opening Hours</Label>
      
      <div className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50/50">
        
        {/* Days Selection */}
        <div className="flex-1 space-y-2">
          <span className="text-xs text-gray-500 uppercase tracking-wide font-bold">Days</span>
          <div className="flex items-center gap-2">
            <Select value={startDay} onValueChange={setStartDay}>
              <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                {days.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
            <span className="text-gray-400">-</span>
            <Select value={endDay} onValueChange={setEndDay}>
              <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                {days.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Time Selection */}
        <div className="flex-1 space-y-2">
          <span className="text-xs text-gray-500 uppercase tracking-wide font-bold">Hours</span>
          <div className="flex items-center gap-2">
            <Input 
              type="time" 
              className="bg-white cursor-pointer"
              value={startTime} 
              onChange={(e) => setStartTime(e.target.value)} 
            />
            <span className="text-gray-400">-</span>
            <Input 
              type="time" 
              className="bg-white cursor-pointer"
              value={endTime} 
              onChange={(e) => setEndTime(e.target.value)} 
            />
          </div>
        </div>

      </div>
    </div>
  );
}