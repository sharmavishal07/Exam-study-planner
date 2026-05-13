import { StudySettings } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Sparkles, Calendar as CalendarIcon, Zap } from 'lucide-react';

interface SettingsPanelProps {
  settings: StudySettings;
  onUpdate: (settings: StudySettings) => void;
  onGeneratePlan: () => void;
  onReschedule: () => void;
  hasSubjects: boolean;
  hasTasks: boolean;
}

export default function SettingsPanel({
  settings,
  onUpdate,
  onGeneratePlan,
  onReschedule,
  hasSubjects,
  hasTasks,
}: SettingsPanelProps) {
  return (
    <div className="space-y-10 animate-fade-in max-w-2xl">
      <div>
        <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
          <Zap className="h-6 w-6 text-primary fill-primary/20" />
          Time Table Generator
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Configure your study algorithm parameters</p>
      </div>

      <div className="glass-panel rounded-[2.5rem] p-8 space-y-8 border-none relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 blur-3xl -z-10" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Daily Capacity (Hours)</Label>
            <Input
              type="number"
              min={1}
              max={12}
              value={settings.hours_available_per_day}
              onChange={(e) =>
                onUpdate({ ...settings, hours_available_per_day: Number(e.target.value) })
              }
              className="bg-white/5 border-none h-12 rounded-xl px-4 text-lg font-semibold"
            />
          </div>
          <div className="space-y-3">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Topic Limit (Optional)</Label>
            <Input
              type="number"
              min={1}
              max={20}
              placeholder="Unlimited"
              value={settings.max_topics_per_day || ''}
              onChange={(e) =>
                onUpdate({ 
                  ...settings, 
                  max_topics_per_day: e.target.value ? Number(e.target.value) : undefined 
                })
              }
              className="bg-white/5 border-none h-12 rounded-xl px-4 text-lg font-semibold"
            />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10 flex gap-4">
           <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
           <p className="text-xs text-muted-foreground leading-relaxed">
             <span className="font-bold text-primary uppercase tracking-tighter mr-1">Algorithm Hint:</span> 
             At {settings.hours_available_per_day} hours/day, you can fit approx. 
             <span className="text-foreground font-bold mx-1">{Math.floor(settings.hours_available_per_day * 60 / 20)}</span> easy sessions 
             or <span className="text-foreground font-bold mx-1">{Math.floor(settings.hours_available_per_day * 60 / 45)}</span> intensive ones.
           </p>
        </div>

        <div className="space-y-4">
          <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Weekly Break Days</Label>
          <ToggleGroup 
            type="multiple" 
            value={(settings.custom_holidays || []).map(String)}
            onValueChange={(values) => {
              const newHolidays = values.map(Number);
              onUpdate({ ...settings, custom_holidays: newHolidays });
            }}
            className="justify-start gap-2 flex-wrap"
          >
            {[
              { val: '1', label: 'Mon' },
              { val: '2', label: 'Tue' },
              { val: '3', label: 'Wed' },
              { val: '4', label: 'Thu' },
              { val: '5', label: 'Fri' },
              { val: '6', label: 'Sat' },
              { val: '0', label: 'Sun' },
            ].map(day => (
              <ToggleGroupItem 
                key={day.val} 
                value={day.val} 
                className="h-12 w-12 rounded-xl bg-white/5 border-none data-[state=on]:bg-primary data-[state=on]:text-primary-foreground font-bold transition-all"
              >
                {day.label[0]}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <div className="space-y-3">
          <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
            <CalendarIcon className="h-3 w-3" />
            Commencement Date
          </Label>
          <Input
            type="date"
            value={settings.start_date}
            onChange={(e) => onUpdate({ ...settings, start_date: e.target.value })}
            className="bg-white/5 border-none h-12 rounded-xl px-4 font-medium max-w-xs"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <Button 
          onClick={onGeneratePlan} 
          disabled={!hasSubjects} 
          className="h-14 flex-1 rounded-2xl bg-primary text-primary-foreground font-bold text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform"
        >
          Generate Optimized Plan
        </Button>
        <Button 
          variant="outline" 
          onClick={onReschedule} 
          disabled={!hasTasks}
          className="h-14 px-8 rounded-2xl border-white/5 bg-white/5 font-bold hover:bg-white/10"
        >
          Reschedule
        </Button>
      </div>
    </div>
  );
}
