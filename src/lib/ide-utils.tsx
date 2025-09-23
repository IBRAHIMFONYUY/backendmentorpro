
import { File, FileJson, FileText, Code, Braces, FileCode, Database, FileImage } from "lucide-react";
import { FaJs, FaPython, FaHtml5, FaCss3Alt, FaReact, FaSass, FaVuejs, FaAngular, FaNodeJs, FaJava } from "react-icons/fa";
import { SiTypescript, SiRust } from "react-icons/si";

export const getFileIcon = (filename: string, isFolder?: boolean, isOpen?: boolean) => {
    if (isFolder) {
        return <FileCode className="h-4 w-4 text-blue-400 shrink-0" />;
    }
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
        case 'js':
            return <FaJs className="h-4 w-4 text-yellow-400 shrink-0" />;
        case 'jsx':
            return <FaReact className="h-4 w-4 text-sky-400 shrink-0" />;
        case 'ts':
            return <SiTypescript className="h-4 w-4 text-blue-500 shrink-0" />;
        case 'tsx':
            return <FaReact className="h-4 w-4 text-blue-400 shrink-0" />;
        case 'json':
            return <Braces className="h-4 w-4 text-yellow-500 shrink-0" />;
        case 'py':
            return <FaPython className="h-4 w-4 text-blue-400 shrink-0" />;
        case 'html':
            return <FaHtml5 className="h-4 w-4 text-orange-500 shrink-0" />;
        case 'css':
            return <FaCss3Alt className="h-4 w-4 text-blue-500 shrink-0" />;
        case 'scss':
        case 'sass':
            return <FaSass className="h-4 w-4 text-pink-500 shrink-0" />;
        case 'md':
        case 'markdown':
            return <FileText className="h-4 w-4 text-gray-400 shrink-0" />;
        case 'vue':
            return <FaVuejs className="h-4 w-4 text-green-500 shrink-0" />;
        case 'angular':
            return <FaAngular className="h-4 w-4 text-red-600 shrink-0" />;
        case 'node':
            return <FaNodeJs className="h-4 w-4 text-green-600 shrink-0" />;
        case 'java':
            return <FaJava className="h-4 w-4 text-red-500 shrink-0" />;
        case 'rs':
            return <SiRust className="h-4 w-4 text-orange-600 shrink-0" />;
        case 'sql':
        case 'db':
            return <Database className="h-4 w-4 text-indigo-400 shrink-0" />;
        case 'png':
        case 'jpg':
        case 'jpeg':
        case 'gif':
        case 'svg':
            return <FileImage className="h-4 w-4 text-purple-400 shrink-0" />;
        default:
            return <File className="h-4 w-4 text-muted-foreground shrink-0" />;
    }
}
