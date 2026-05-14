import { useState } from 'react';
import { Subject, Difficulty } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Plus, ListChecks, Calendar as CalendarIcon, Target, BookOpen } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface SubjectManagerProps {
  subjects: Subject[];
  onAdd: (subject: Omit<Subject, 'id' | 'completed_topics'>) => void;
  onDelete: (id: string) => void;
  showAddDialog: boolean;
  onShowAddDialog: (v: boolean) => void;
}

const difficultyColors: Record<Difficulty, string> = {
  hard: 'text-destructive bg-destructive/10',
  medium: 'text-orange-500 bg-orange-500/10',
  easy: 'text-primary bg-primary/10',
};

export default function SubjectManager({ subjects, onAdd, onDelete, showAddDialog, onShowAddDialog }: SubjectManagerProps) {
  const [name, setName] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [examDate, setExamDate] = useState('');
  const [totalTopics, setTotalTopics] = useState(10);
  const [topicTitlesText, setTopicTitlesText] = useState('');

  const handleTopicTitlesChange = (text: string) => {
    setTopicTitlesText(text);
    const titles = text.split('\n').filter(line => line.trim() !== '');
    if (titles.length > 0) {
      setTotalTopics(titles.length);
    }
  };

  const handleAdd = () => {
    if (!name || !examDate) return;
    const topic_titles = topicTitlesText.split('\n').filter(line => line.trim() !== '');
    const finalTotalTopics = topic_titles.length > 0 ? topic_titles.length : totalTopics;
    
    onAdd({ 
      name, 
      difficulty, 
      exam_date: examDate, 
      total_topics: finalTotalTopics,
      topic_titles: topic_titles.length > 0 ? topic_titles : undefined
    });
    
    setName('');
    setDifficulty('medium');
    setExamDate('');
    setTotalTopics(10);
    setTopicTitlesText('');
    onShowAddDialog(false);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Your Subjects</h2>
          <p className="text-sm text-muted-foreground">Manage your curriculum and exam schedule</p>
        </div>
        
        <Dialog open={showAddDialog} onOpenChange={onShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="rounded-2xl bg-primary text-primary-foreground font-bold px-6 h-12 shadow-lg shadow-primary/20">
              <Plus className="h-5 w-5 mr-2" />
              Add Subject
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-panel border-white/5 sm:max-w-[500px] rounded-[2rem] p-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold tracking-tight">Create Subject</DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 py-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Title</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Mathematics" className="bg-white/5 border-none h-12 rounded-xl px-4" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Difficulty</Label>
                  <Select value={difficulty} onValueChange={(v) => setDifficulty(v as Difficulty)}>
                    <SelectTrigger className="bg-white/5 border-none h-12 rounded-xl px-4 text-left font-medium"><SelectValue /></SelectTrigger>
                    <SelectContent className="glass-panel border-white/5">
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Exam Date</Label>
                  <Input type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} className="bg-white/5 border-none h-12 rounded-xl px-4" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Topics Count</Label>
                  <Input 
                    type="number" 
                    value={totalTopics} 
                    onChange={(e) => setTotalTopics(Number(e.target.value))} 
                    min={1} 
                    disabled={topicTitlesText.split('\n').filter(line => line.trim() !== '').length > 0}
                    className="bg-white/5 border-none h-12 rounded-xl px-4"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between mb-1">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Topic Names (Optional)</Label>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest">One per line</span>
                </div>
                <Textarea 
                  placeholder="Topic 1&#10;Topic 2&#10;Topic 3..." 
                  value={topicTitlesText} 
                  onChange={(e) => handleTopicTitlesChange(e.target.value)}
                  className="min-h-[120px] bg-white/5 border-none rounded-xl p-4 text-xs font-mono"
                />
              </div>

              <Button onClick={handleAdd} className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-bold text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform mt-4">
                Create Subject
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {subjects.length === 0 ? (
        <div className="glass-panel p-20 rounded-[3rem] text-center border-dashed border-white/10">
          <BookOpen className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
          <p className="text-muted-foreground font-medium italic">No subjects added yet. Start by adding your first subject!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subjects.map((s) => {
            const progress = s.total_topics > 0 ? Math.round((s.completed_topics / s.total_topics) * 100) : 0;
            const daysLeft = Math.ceil((new Date(s.exam_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            
            return (
              <Card key={s.id} className="glass-panel p-6 rounded-[2.5rem] border-none group hover:bg-card/80 transition-all relative overflow-hidden">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary">
                      <Target className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold tracking-tight">{s.name}</h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" />
                        {new Date(s.exam_date).toLocaleDateString()} ({daysLeft}d left)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={cn("rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-tighter border-none", difficultyColors[s.difficulty])}>
                      {s.difficulty}
                    </Badge>
                    <button 
                      onClick={() => onDelete(s.id)}
                      className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-1">
                    <span className="text-muted-foreground">Mastery</span>
                    <span className="text-primary">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2 rounded-full bg-white/5" />
                  <p className="text-[10px] text-muted-foreground italic text-right pt-1">
                    {s.completed_topics} of {s.total_topics} topics mastered
                  </p>
                </div>

                {/* Decorative background element */}
                <div className="absolute -bottom-8 -left-8 h-20 w-20 bg-primary/5 blur-3xl -z-10 group-hover:bg-primary/10 transition-all" />
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
