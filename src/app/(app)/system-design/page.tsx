
'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { produce } from 'immer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { analyzeSystemDesign, type AnalyzeSystemDesignOutput } from '@/ai/flows/analyze-system-design';
import { Server, Database, ToyBrick, Waypoints, Info, AlertTriangle, Lightbulb, CheckCircle, Bot, Loader2, Wand2, MousePointer2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { debounce } from 'lodash';

// Data Types
type ComponentType = 'Web Server' | 'API Gateway' | 'Database' | 'Cache' | 'Load Balancer' | 'Message Queue' | 'User';
type SystemComponent = {
  id: string;
  type: ComponentType;
  label: string;
  connections: string[];
  position: { x: number; y: number };
};
type Feedback = AnalyzeSystemDesignOutput['feedback'][0];

type DragState = {
  componentId: string;
  offsetX: number;
  offsetY: number;
} | null;

// Component Data
const TOOLBOX_ITEMS: { type: ComponentType; icon: React.ReactNode }[] = [
  { type: 'User', icon: <ToyBrick className="w-6 h-6" /> },
  { type: 'Load Balancer', icon: <Waypoints className="w-6 h-6" /> },
  { type: 'Web Server', icon: <Server className="w-6 h-6" /> },
  { type: 'API Gateway', icon: <Server className="w-6 h-6 text-purple-400" /> },
  { type: 'Database', icon: <Database className="w-6 h-6" /> },
  { type: 'Cache', icon: <ToyBrick className="w-6 h-6 text-red-400" /> },
  { type: 'Message Queue', icon: <Waypoints className="w-6 h-6 text-orange-400" /> },
];

// Main Page Component
export default function SystemDesignPage() {
  const [components, setComponents] = useState<SystemComponent[]>([]);
  const [description, setDescription] = useState('A scalable social media feed');
  const [analysis, setAnalysis] = useState<AnalyzeSystemDesignOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const [dragState, setDragState] = useState<DragState>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [highlightedComponentIds, setHighlightedComponentIds] = useState<Set<string>>(new Set());


  const getAIAnalysis = useCallback(
    debounce(async (currentComponents: SystemComponent[], currentDescription: string) => {
      setIsLoading(true);
      try {
        const result = await analyzeSystemDesign({
          description: currentDescription,
          components: currentComponents.map(c => ({
            id: c.id,
            type: c.type,
            connections: c.connections,
          })),
        });
        setAnalysis(result);
      } catch (error) {
        console.error("AI analysis failed:", error);
        toast({ variant: 'destructive', title: 'AI Analysis Error' });
      } finally {
        setIsLoading(false);
      }
    }, 1000),
    [toast]
  );

  useEffect(() => {
    getAIAnalysis(components, description);
  }, [components, description, getAIAnalysis]);

  const addComponent = (type: ComponentType) => {
    const newComponent: SystemComponent = {
      id: `${type.toLowerCase().replace(' ', '-')}-${Date.now()}`,
      type,
      label: `${type} ${components.filter(c => c.type === type).length + 1}`,
      connections: [],
      position: { x: 50 + Math.random() * 200, y: 50 + Math.random() * 200 },
    };
    setComponents(prev => [...prev, newComponent]);
  };
  
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>, componentId: string) => {
    const component = components.find(c => c.id === componentId);
    if (!component || !canvasRef.current) return;
    
    e.stopPropagation();
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const offsetX = e.clientX - canvasRect.left - component.position.x;
    const offsetY = e.clientY - canvasRect.top - component.position.y;

    setDragState({ componentId, offsetX, offsetY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragState || !canvasRef.current) return;
    
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const newX = e.clientX - canvasRect.left - dragState.offsetX;
    const newY = e.clientY - canvasRect.top - dragState.offsetY;

    setComponents(prev => 
      produce(prev, draft => {
        const component = draft.find(c => c.id === dragState.componentId);
        if (component) {
          component.position.x = Math.max(0, Math.min(newX, canvasRect.width - 150)); // prevent going off-screen
          component.position.y = Math.max(0, Math.min(newY, canvasRect.height - 50));
        }
      })
    );
  };

  const handleMouseUp = () => {
    setDragState(null);
  };
  
  return (
    <div className="h-full flex flex-col p-4 md:p-8 gap-8">
      <header>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Waypoints className="text-primary" />
          Interactive System Design Sandbox
        </h1>
        <p className="text-muted-foreground mt-1">
          Design your architecture and get real-time feedback from Rahim, your AI Solutions Architect.
        </p>
      </header>

      <div className="grid lg:grid-cols-4 gap-8 flex-1 min-h-0">
        {/* Left Panel: Toolbox & Description */}
        <Card className="lg:col-span-1 glass-effect flex flex-col">
          <CardHeader>
            <CardTitle>Design Controls</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6 flex-1">
            <div>
              <Label className="font-semibold mb-2 block">System Goal</Label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., A scalable social media feed"
              />
            </div>
            <div>
              <Label className="font-semibold mb-2 block">Toolbox</Label>
              <div className="grid grid-cols-2 gap-2">
                {TOOLBOX_ITEMS.map(item => (
                  <Button
                    key={item.type}
                    variant="outline"
                    className="flex flex-col h-20 gap-1"
                    onClick={() => addComponent(item.type)}
                  >
                    {item.icon}
                    <span className="text-xs">{item.type}</span>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Center Panel: Canvas */}
        <Card className="lg:col-span-2 glass-effect flex flex-col relative overflow-hidden">
          <CardHeader>
            <CardTitle>Design Canvas</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <MousePointer2 className="h-4 w-4" /> Drag components to arrange your architecture.
            </CardDescription>
          </CardHeader>
          <CardContent
            ref={canvasRef}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="flex-1 bg-grid p-4 relative"
          >
            {components.map(comp => (
              <div
                key={comp.id}
                onMouseDown={(e) => handleMouseDown(e, comp.id)}
                className={cn(
                  'absolute p-2 rounded-lg glass-effect border-2 flex items-center gap-2 transition-all duration-300',
                  dragState?.componentId === comp.id ? 'cursor-grabbing border-primary shadow-lg shadow-primary/30' : 'cursor-grab',
                  highlightedComponentIds.has(comp.id) && dragState?.componentId !== comp.id ? 'border-primary shadow-lg shadow-primary/30' : 'border-border'
                )}
                style={{ left: `${comp.position.x}px`, top: `${comp.position.y}px` }}
              >
                {TOOLBOX_ITEMS.find(i => i.type === comp.type)?.icon}
                <div className="text-xs font-medium">{comp.label}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Right Panel: AI Feedback */}
        <Card className="lg:col-span-1 glass-effect flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="text-primary"/>
              AI Architect Feedback
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-4 overflow-y-auto">
            <div className="p-3 bg-background/50 rounded-lg space-y-1">
                <div className='flex items-center gap-2'>
                    <h4 className="font-semibold text-sm">Overall Analysis</h4>
                    {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                </div>
              <p className="text-xs text-muted-foreground">
                {analysis?.overallAnalysis || 'Waiting for design...'}
              </p>
            </div>
            <div className="space-y-3">
              {analysis?.feedback.map((item, index) => (
                <FeedbackCard 
                    key={index} 
                    item={item} 
                    onMouseEnter={() => setHighlightedComponentIds(new Set(item.componentIds || []))}
                    onMouseLeave={() => setHighlightedComponentIds(new Set())}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Sub-components
const FeedbackCard = ({ item, onMouseEnter, onMouseLeave }: { item: Feedback, onMouseEnter: () => void, onMouseLeave: () => void }) => {
  const getIcon = () => {
    switch (item.type) {
      case 'praise': return <CheckCircle className="text-green-500" />;
      case 'suggestion': return <Lightbulb className="text-blue-400" />;
      case 'warning': return <AlertTriangle className="text-yellow-500" />;
      default: return <Info className="text-muted-foreground" />;
    }
  };

  return (
    <div 
        className="flex items-start gap-3 text-sm p-3 bg-background/30 rounded-lg transition-all duration-200 hover:bg-background/60"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
    >
      <div className="mt-0.5 shrink-0">{getIcon()}</div>
      <p className="text-muted-foreground">{item.message}</p>
    </div>
  );
};
