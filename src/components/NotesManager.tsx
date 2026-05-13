import { useState, useEffect } from 'react';
import { Note, Subject } from '@/lib/types';
import { api } from '@/lib/api';
import { useAuth } from './AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Plus, 
  Search, 
  Trash2, 
  Save, 
  BookOpen, 
  Clock,
  ChevronRight,
  MoreVertical
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface NotesManagerProps {
  subjects: Subject[];
}

export default function NotesManager({ subjects }: NotesManagerProps) {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [search, setSearch] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  // Form state
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editSubjectId, setEditSubjectId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadNotes();
    }
  }, [user]);

  const loadNotes = async () => {
    try {
      const data = await api.getNotes(user!.id);
      setNotes(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load notes");
    }
  };

  const handleCreateNew = () => {
    setSelectedNote(null);
    setEditTitle('Untitled Note');
    setEditContent('');
    setEditSubjectId(subjects[0]?.id || null);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!user) return;
    try {
      if (selectedNote) {
        // Update
        await api.updateNote(user.id, selectedNote.id, {
          title: editTitle,
          content: editContent,
          subject_id: editSubjectId
        });
        toast.success("Note updated");
      } else {
        // Create
        const res = await api.createNote(user.id, {
          title: editTitle,
          content: editContent,
          subject_id: editSubjectId
        });
        toast.success("Note created");
      }
      loadNotes();
      setIsEditing(false);
    } catch (err) {
      toast.error("Failed to save note");
    }
  };

  const handleDelete = async (id: string) => {
    if (!user || !confirm("Are you sure you want to delete this note?")) return;
    try {
      await api.deleteNote(user.id, id);
      toast.success("Note deleted");
      if (selectedNote?.id === id) {
        setSelectedNote(null);
        setIsEditing(false);
      }
      loadNotes();
    } catch (err) {
      toast.error("Failed to delete note");
    }
  };

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(search.toLowerCase()) || 
    n.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-full gap-8 animate-fade-in overflow-hidden">
      {/* Left Sidebar: List of Notes */}
      <div className="w-80 flex flex-col gap-6 h-full">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight">Study Notes</h2>
          <Button 
            size="icon" 
            onClick={handleCreateNew}
            className="rounded-xl h-10 w-10 bg-primary text-primary-foreground shadow-lg shadow-primary/20"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search notes..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-white/5 border-none h-11 rounded-xl"
          />
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-10 opacity-30 italic text-sm">No notes found</div>
          ) : (
            filteredNotes.map(n => {
              const subject = subjects.find(s => s.id === n.subject_id);
              return (
                <button
                  key={n.id}
                  onClick={() => {
                    setSelectedNote(n);
                    setEditTitle(n.title);
                    setEditContent(n.content);
                    setEditSubjectId(n.subject_id);
                    setIsEditing(true);
                  }}
                  className={cn(
                    "w-full text-left p-4 rounded-2xl border border-white/5 transition-all group relative",
                    selectedNote?.id === n.id ? "bg-primary/10 border-primary/20" : "bg-card/30 hover:bg-card/50"
                  )}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-sm truncate pr-4">{n.title}</h3>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 
                        className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive transition-colors" 
                        onClick={(e) => { e.stopPropagation(); handleDelete(n.id); }}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{n.content}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-white/10 bg-white/5 text-muted-foreground uppercase font-black tracking-tighter">
                      {subject?.name || "General"}
                    </Badge>
                    <span className="text-[9px] text-muted-foreground opacity-50 font-bold">
                      {new Date(n.last_updated).toLocaleDateString()}
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Right Content: Editor */}
      <div className="flex-1 h-full">
        {isEditing ? (
          <div className="glass-panel h-full rounded-[2.5rem] border-none flex flex-col overflow-hidden">
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex-1 max-w-xl">
                <input 
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Note Title"
                  className="bg-transparent text-3xl font-bold border-none outline-none w-full placeholder:opacity-20"
                />
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <BookOpen className="h-3.5 w-3.5" />
                    <select 
                      className="bg-transparent border-none outline-none font-bold text-primary cursor-pointer"
                      value={editSubjectId || ''}
                      onChange={(e) => setEditSubjectId(e.target.value || null)}
                    >
                      <option value="">General Note</option>
                      {subjects.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="h-1 w-1 bg-white/20 rounded-full" />
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-bold uppercase tracking-widest">
                    <Clock className="h-3.5 w-3.5" />
                    Last Saved: {selectedNote ? new Date(selectedNote.last_updated).toLocaleTimeString() : 'Never'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                  className="rounded-xl border-white/5 bg-white/5 font-bold"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave}
                  className="rounded-xl bg-primary text-primary-foreground font-bold px-6 shadow-lg shadow-primary/20"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Note
                </Button>
              </div>
            </div>
            
            <div className="flex-1 p-8">
              <Textarea 
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="Start writing your study materials here..."
                className="w-full h-full bg-transparent border-none resize-none p-0 focus-visible:ring-0 text-lg leading-relaxed placeholder:opacity-10 custom-scrollbar"
              />
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center glass-panel rounded-[2.5rem] border-none border-dashed border-white/5 opacity-50">
            <div className="h-20 w-20 rounded-[2rem] bg-white/5 flex items-center justify-center text-muted-foreground mb-6">
              <FileText className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold tracking-tight">Select a note to view</h3>
            <p className="text-sm text-muted-foreground mt-2">Or create a new one to capture your thoughts</p>
            <Button 
              onClick={handleCreateNew}
              variant="outline"
              className="mt-8 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 font-bold px-8 h-12"
            >
              <Plus className="h-5 w-5 mr-2" />
              New Study Note
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
