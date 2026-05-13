import { useState } from 'react';
import { Subject, Difficulty } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Plus, ListChecks, BookOpen, Clock, Target } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface SubjectManagerProps {
  subjects: Subject[];
  onAdd: (subject: Omit<Subject, 'id' | 'completed_topics'>) => void;
  onDelete: (id: string) => void;
  showAddDialog: boolean;
  onShowAddDialog: (v: boolean) => void;
}

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
    <div className="space-y-10 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Academic Performance</h2>
          <p className="text-sm text-muted-foreground">Manage your subjects and tracking goals</p>
        </div>
        
        <Dialog open={showAddDialog} onOpenChange={onShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="rounded-2xl bg-primary text-primary-foreground font-bold px-6 h-12 shadow-lg shadow-primary/20">
              <Plus className="h-5 w-5 mr-2" />
              New Subject
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-panel border-white/5 sm:max-w-[500px] rounded-[2rem] p-8 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -z-10" />
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold tracking-tight">Expand Curriculum</DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 py-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Title</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Quantum Physics" className="bg-white/5 border-none h-12 rounded-xl px-4" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Level</Label>
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
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Final Exam</Label>
                  <Input type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} className="bg-white/5 border-none h-12 rounded-xl px-4 invert dark:invert-0" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Topics</Label>
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
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Topic Breakdown</Label>
                <Textarea 
                  placeholder="One topic per line..." 
                  value={topicTitlesText} 
                  onChange={(e) => handleTopicTitlesChange(e.target.value)}
                  className="min-h-[120px] bg-white/5 border-none rounded-xl p-4 text-xs font-mono"
                />
              </div>

              <Button onClick={handleAdd} className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-bold text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform mt-4">
                Initialize Plan
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="glass-panel rounded-[2.5rem] p-8 border-none space-y-6">
        <div className="flex items-center text-xs font-bold text-muted-foreground uppercase tracking-widest border-b border-white/5 pb-4 px-4">
          <div className="flex-1">Subject / Course</div>
          <div className="w-32 text-center">Status</div>
          <div className="w-32 text-center">Mastery</div>
          <div className="w-16"></div>
        </div>

        {subjects.length === 0 ? (
          <div className="py-20 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-muted-foreground font-medium italic">Your academic ledger is empty</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {subjects.map((s) => {
              const progress = s.total_topics > 0 ? Math.round((s.completed_topics / s.total_topics) * 100) : 0;
              const daysLeft = Math.ceil((new Date(s.exam_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
              
              return (
                <div key={s.id} className="group flex items-center py-6 px-4 hover:bg-white/[0.02] transition-colors first:pt-0 last:pb-0">
                  <div className="flex-1 flex items-center gap-6">
                    <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <Target className="h-7 w-7 text-primary/50 group-hover:text-primary transition-colors" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold tracking-tight">{s.name}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                          <Clock className="h-3 w-3" />
                          {daysLeft}d Remaining
                        </span>
                        <div className="h-1 w-1 bg-white/20 rounded-full" />
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                          {s.total_topics} Units
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="w-32 text-center">
                    <Badge className={cn(
                      "rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-tighter border-none",
                      s.difficulty === 'hard' ? 'bg-destructive/10 text-destructive' : 
                      s.difficulty === 'medium' ? 'bg-orange-500/10 text-orange-500' : 
                      'bg-primary/10 text-primary'
                    )}>
                      {s.difficulty}
                    </Badge>
                  </div>

                  <div className="w-32 text-center">
                    <div className="inline-block relative">
                       <span className="text-xl font-bold tracking-tighter">{progress}%</span>
                       <div className="h-1 w-full bg-white/5 rounded-full mt-1 overflow-hidden">
                         <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
                       </div>
                    </div>
                  </div>

                  <div className="w-16 flex justify-end">
                    <button 
                      onClick={() => onDelete(s.id)}
                      className="p-3 rounded-xl bg-white/5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
