
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { ScrollArea } from "../ui/scroll-area";
import { Server, Code, Boxes, MessageSquare, ShoppingCart, Rocket } from "lucide-react";
import { FaPython, FaLaravel, FaFire, FaFileCode } from "react-icons/fa";
import { SiRust } from "react-icons/si";

const templates = [
  { id: "rest-api", name: "REST API", description: "Express.js + JWT Auth", icon: <Server /> },
  { id: "graphql", name: "GraphQL API", description: "Apollo Server + TS", icon: <Code /> },
  { id: "microservices", name: "Microservices", description: "Docker + Kubernetes", icon: <Boxes /> },
  { id: "realtime-chat", name: "Real-time Chat", description: "Socket.io + Redis", icon: <MessageSquare /> },
  { id: "ecommerce", name: "E-commerce API", description: "Stripe + PostgreSQL", icon: <ShoppingCart /> },
  { id: "django", name: "Django API", description: "Python DRF", icon: <FaPython /> },
  { id: "rust", name: "Rust API", description: "Actix-web framework", icon: <SiRust /> },
  { id: "laravel", name: "Laravel API", description: "PHP Laravel", icon: <FaLaravel /> },
  { id: "firebase", name: "Firebase Backend", description: "Node.js + Firebase", icon: <FaFire /> },
  { id: "blank", name: "Blank Project", description: "Start from scratch", icon: <FaFileCode /> },
];

export function NewProjectModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [selectedTemplate, setSelectedTemplate] = useState("rest-api");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-effect sm:max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">Start New Project</DialogTitle>
          <DialogDescription>Choose a template or start from scratch to kickstart your development.</DialogDescription>
        </DialogHeader>
        
        <div className="flex-grow min-h-0">
          <ScrollArea className="h-full -mx-6 px-6">
              <div className="py-4">
                  <h3 className="text-lg font-semibold mb-4">Choose a Template</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {templates.map(template => (
                          <div key={template.id} 
                               className={`p-4 rounded-lg cursor-pointer border-2 transition-all ${selectedTemplate === template.id ? 'border-primary shadow-lg shadow-primary/20' : 'border-border'} bg-card/50 hover:border-primary/80`}
                               onClick={() => setSelectedTemplate(template.id)}>
                              <div className="flex items-center space-x-3 mb-3">
                                  <div className={`w-10 h-10 bg-primary/20 text-primary rounded-lg flex items-center justify-center`}>
                                      {template.icon}
                                  </div>
                                  <div>
                                      <h4 className="font-semibold">{template.name}</h4>
                                      <p className="text-xs text-muted-foreground">{template.description}</p>
                                  </div>
                              </div>
                          </div>
                      ))}
                  </div>

                  <div className="border-t mt-6 pt-6">
                      <h3 className="text-lg font-semibold mb-4">Project Configuration</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div>
                              <label className="block text-sm font-medium mb-2">Project Name</label>
                              <Input placeholder="my-awesome-project" defaultValue={selectedTemplate} />
                          </div>
                          <div>
                              <label className="block text-sm font-medium mb-2">Description</label>
                              <Input placeholder="A brief description of your project" />
                          </div>
                          <div>
                              <label className="block text-sm font-medium mb-2">Node.js Version</label>
                              <Select defaultValue="20">
                                  <SelectTrigger><SelectValue /></SelectTrigger>
                                  <SelectContent>
                                      <SelectItem value="18">Node.js 18 LTS</SelectItem>
                                      <SelectItem value="20">Node.js 20 LTS</SelectItem>
                                      <SelectItem value="21">Node.js 21</SelectItem>
                                  </SelectContent>
                              </Select>
                          </div>
                          <div>
                              <label className="block text-sm font-medium mb-2">Package Manager</label>
                              <Select defaultValue="npm">
                                  <SelectTrigger><SelectValue /></SelectTrigger>
                                  <SelectContent>
                                      <SelectItem value="npm">npm</SelectItem>
                                      <SelectItem value="yarn">Yarn</SelectItem>
                                      <SelectItem value="pnpm">pnpm</SelectItem>
                                  </SelectContent>
                              </Select>
                          </div>
                      </div>

                      <div className="mt-6">
                          <h4 className="text-md font-medium mb-3">Additional Options</h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                              <div className="flex items-center space-x-2"><Checkbox id="includeDocker" /><label htmlFor="includeDocker" className="text-sm">Docker Setup</label></div>
                              <div className="flex items-center space-x-2"><Checkbox id="includeTests" defaultChecked /><label htmlFor="includeTests" className="text-sm">Testing Framework</label></div>
                              <div className="flex items-center space-x-2"><Checkbox id="includeESLint" defaultChecked /><label htmlFor="includeESLint" className="text-sm">ESLint + Prettier</label></div>
                              <div className="flex items-center space-x-2"><Checkbox id="includeTypeScript" /><label htmlFor="includeTypeScript" className="text-sm">TypeScript</label></div>
                              <div className="flex items-center space-x-2"><Checkbox id="includeCI" /><label htmlFor="includeCI" className="text-sm">GitHub Actions</label></div>
                              <div className="flex items-center space-x-2"><Checkbox id="includeSwagger" /><label htmlFor="includeSwagger" className="text-sm">API Docs</label></div>
                          </div>
                      </div>
                  </div>
              </div>
          </ScrollArea>
        </div>
        
        <DialogFooter className="pt-4 border-t">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button className="btn-primary-gradient" onClick={onClose}><Rocket className="mr-2"/>Create Project</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
