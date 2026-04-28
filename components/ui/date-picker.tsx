"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DatePickerProps {
  id?: string
  selected?: Date
  onSelect?: (date: Date | undefined) => void
}

export function DatePicker({ id, selected, onSelect }: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(selected)

  React.useEffect(() => {
    setDate(selected)
  }, [selected])

  const handleSelectDate = (newDate: Date | undefined) => {
    setDate(newDate)
    if (onSelect) {
      onSelect(newDate)
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant={"outline"}
          className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={date} onSelect={handleSelectDate} initialFocus />
      </PopoverContent>
    </Popover>
  )
}
