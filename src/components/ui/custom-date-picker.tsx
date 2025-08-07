import React, { useState, useRef, useEffect } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Calendar, ChevronLeft, ChevronRight, Clock, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CustomDatePickerProps {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  placeholder?: string;
  className?: string;
  showTime?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

interface CustomTimePickerProps {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  value,
  onChange,
  placeholder = "Select date",
  className,
  showTime = false,
  disabled = false,
  size = 'md'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(value || new Date());
  const [selectedDate, setSelectedDate] = useState(value);
  const [selectedTime, setSelectedTime] = useState(value ? {
    hours: value.getHours(),
    minutes: value.getMinutes()
  } : { hours: 0, minutes: 0 });
  const [showTimePicker, setShowTimePicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowTimePicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (value) {
      setCurrentDate(value);
      setSelectedDate(value);
      setSelectedTime({
        hours: value.getHours(),
        minutes: value.getMinutes()
      });
    }
  }, [value]);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    if (showTime) {
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    }
    return `${year}-${month}-${day}`;
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(newDate);
    
    if (showTime) {
      setShowTimePicker(true);
    } else {
      const finalDate = new Date(newDate);
      finalDate.setHours(selectedTime.hours, selectedTime.minutes);
      onChange?.(finalDate);
      setIsOpen(false);
    }
  };

  const handleTimeSelect = () => {
    if (selectedDate) {
      const finalDate = new Date(selectedDate);
      finalDate.setHours(selectedTime.hours, selectedTime.minutes);
      onChange?.(finalDate);
      setIsOpen(false);
      setShowTimePicker(false);
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const isToday = (day: number) => {
    const today = new Date();
    return currentDate.getFullYear() === today.getFullYear() &&
           currentDate.getMonth() === today.getMonth() &&
           day === today.getDate();
  };

  const isSelected = (day: number) => {
    return selectedDate &&
           currentDate.getFullYear() === selectedDate.getFullYear() &&
           currentDate.getMonth() === selectedDate.getMonth() &&
           day === selectedDate.getDate();
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8 sm:h-10 sm:w-10" />);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        <button
          key={day}
          onClick={() => handleDateSelect(day)}
          className={cn(
            "h-8 w-8 sm:h-10 sm:w-10 rounded-md text-xs sm:text-sm transition-all duration-200 hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
            isToday(day) && "bg-primary text-primary-foreground font-semibold",
            isSelected(day) && "bg-primary text-primary-foreground font-semibold shadow-md",
            !isToday(day) && !isSelected(day) && "text-foreground hover:scale-105"
          )}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const renderTimePicker = () => {
    return (
      <div className="p-4 border-t bg-muted/20">
        <div className="flex items-center justify-between mb-4">
          <Label className="text-sm font-medium">Select Time</Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowTimePicker(false)}
            className="text-xs sm:text-sm"
          >
            ← Back to Date
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">Hours</Label>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedTime(prev => ({
                  ...prev,
                  hours: prev.hours > 0 ? prev.hours - 1 : 23
                }))}
                className="h-8 w-8 p-0"
              >
                -
              </Button>
              <Input
                value={String(selectedTime.hours).padStart(2, '0')}
                onChange={(e) => {
                  const hours = parseInt(e.target.value) || 0;
                  setSelectedTime(prev => ({
                    ...prev,
                    hours: Math.min(23, Math.max(0, hours))
                  }));
                }}
                className="w-16 text-center text-sm"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedTime(prev => ({
                  ...prev,
                  hours: prev.hours < 23 ? prev.hours + 1 : 0
                }))}
                className="h-8 w-8 p-0"
              >
                +
              </Button>
            </div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">Minutes</Label>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedTime(prev => ({
                  ...prev,
                  minutes: prev.minutes > 0 ? prev.minutes - 1 : 59
                }))}
                className="h-8 w-8 p-0"
              >
                -
              </Button>
              <Input
                value={String(selectedTime.minutes).padStart(2, '0')}
                onChange={(e) => {
                  const minutes = parseInt(e.target.value) || 0;
                  setSelectedTime(prev => ({
                    ...prev,
                    minutes: Math.min(59, Math.max(0, minutes))
                  }));
                }}
                className="w-16 text-center text-sm"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedTime(prev => ({
                  ...prev,
                  minutes: prev.minutes < 59 ? prev.minutes + 1 : 0
                }))}
                className="h-8 w-8 p-0"
              >
                +
              </Button>
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsOpen(false);
              setShowTimePicker(false);
            }}
            className="text-xs sm:text-sm"
          >
            Cancel
          </Button>
          <Button size="sm" onClick={handleTimeSelect} className="text-xs sm:text-sm">
            Confirm
          </Button>
        </div>
      </div>
    );
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-8 text-xs px-2';
      case 'lg':
        return 'h-12 text-base px-4';
      default:
        return 'h-10 text-sm px-3';
    }
  };

  return (
    <div className="relative" ref={pickerRef}>
      <Button
        variant="outline"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          "w-full justify-start text-left font-normal transition-all duration-200 hover:bg-accent/50",
          getSizeClasses(),
          !value && "text-muted-foreground",
          className
        )}
        disabled={disabled}
      >
        <Calendar className="mr-2 h-4 w-4 flex-shrink-0" />
        <span className="truncate">{formatDate(value) || placeholder}</span>
        {value && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onChange?.(null);
            }}
            className="ml-auto h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </Button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-background border rounded-lg shadow-xl ring-1 ring-black/5 min-w-[280px] sm:min-w-[320px]">
          {!showTimePicker ? (
            <div className="p-3 sm:p-4">
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateMonth('prev')}
                  className="h-8 w-8 p-0 hover:bg-accent"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-sm font-semibold text-center flex-1">
                  {currentDate.toLocaleDateString('en-US', { 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateMonth('next')}
                  className="h-8 w-8 p-0 hover:bg-accent"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center text-xs text-muted-foreground font-medium">
                    {day}
                  </div>
                ))}
                {renderCalendar()}
              </div>
              
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onChange?.(null);
                    setIsOpen(false);
                  }}
                  className="text-xs sm:text-sm"
                >
                  Clear
                </Button>
                {showTime && (
                  <Button
                    size="sm"
                    onClick={() => setShowTimePicker(true)}
                    disabled={!selectedDate}
                    className="text-xs sm:text-sm"
                  >
                    <Clock className="mr-2 h-3 w-3" />
                    Set Time
                  </Button>
                )}
                {!showTime && (
                  <Button
                    size="sm"
                    onClick={() => {
                      if (selectedDate) {
                        const finalDate = new Date(selectedDate);
                        finalDate.setHours(selectedTime.hours, selectedTime.minutes);
                        onChange?.(finalDate);
                      }
                      setIsOpen(false);
                    }}
                    disabled={!selectedDate}
                    className="text-xs sm:text-sm"
                  >
                    Confirm
                  </Button>
                )}
              </div>
            </div>
          ) : (
            renderTimePicker()
          )}
        </div>
      )}
    </div>
  );
};

const CustomTimePicker: React.FC<CustomTimePickerProps> = ({
  value,
  onChange,
  placeholder = "Select time",
  className,
  disabled = false,
  size = 'md'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState(value ? {
    hours: value.getHours(),
    minutes: value.getMinutes()
  } : { hours: 0, minutes: 0 });
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (value) {
      setSelectedTime({
        hours: value.getHours(),
        minutes: value.getMinutes()
      });
    }
  }, [value]);

  const formatTime = (date: Date | null) => {
    if (!date) return '';
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleTimeSelect = () => {
    const newDate = new Date();
    newDate.setHours(selectedTime.hours, selectedTime.minutes);
    onChange?.(newDate);
    setIsOpen(false);
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-8 text-xs px-2';
      case 'lg':
        return 'h-12 text-base px-4';
      default:
        return 'h-10 text-sm px-3';
    }
  };

  return (
    <div className="relative" ref={pickerRef}>
      <Button
        variant="outline"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          "w-full justify-start text-left font-normal transition-all duration-200 hover:bg-accent/50",
          getSizeClasses(),
          !value && "text-muted-foreground",
          className
        )}
        disabled={disabled}
      >
        <Clock className="mr-2 h-4 w-4 flex-shrink-0" />
        <span className="truncate">{formatTime(value) || placeholder}</span>
        {value && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onChange?.(null);
            }}
            className="ml-auto h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </Button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-background border rounded-lg shadow-xl ring-1 ring-black/5 p-4 min-w-[280px] sm:min-w-[320px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Hours</Label>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedTime(prev => ({
                    ...prev,
                    hours: prev.hours > 0 ? prev.hours - 1 : 23
                  }))}
                  className="h-8 w-8 p-0"
                >
                  -
                </Button>
                <Input
                  value={String(selectedTime.hours).padStart(2, '0')}
                  onChange={(e) => {
                    const hours = parseInt(e.target.value) || 0;
                    setSelectedTime(prev => ({
                      ...prev,
                      hours: Math.min(23, Math.max(0, hours))
                    }));
                  }}
                  className="w-16 text-center text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedTime(prev => ({
                    ...prev,
                    hours: prev.hours < 23 ? prev.hours + 1 : 0
                  }))}
                  className="h-8 w-8 p-0"
                >
                  +
                </Button>
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Minutes</Label>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedTime(prev => ({
                    ...prev,
                    minutes: prev.minutes > 0 ? prev.minutes - 1 : 59
                  }))}
                  className="h-8 w-8 p-0"
                >
                  -
                </Button>
                <Input
                  value={String(selectedTime.minutes).padStart(2, '0')}
                  onChange={(e) => {
                    const minutes = parseInt(e.target.value) || 0;
                    setSelectedTime(prev => ({
                      ...prev,
                      minutes: Math.min(59, Math.max(0, minutes))
                    }));
                  }}
                  className="w-16 text-center text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedTime(prev => ({
                    ...prev,
                    minutes: prev.minutes < 59 ? prev.minutes + 1 : 0
                  }))}
                  className="h-8 w-8 p-0"
                >
                  +
                </Button>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-xs sm:text-sm"
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleTimeSelect} className="text-xs sm:text-sm">
              Confirm
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export { CustomDatePicker, CustomTimePicker }; 