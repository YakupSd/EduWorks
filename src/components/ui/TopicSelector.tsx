import { motion } from 'motion/react';
import { Topic } from '../../types';
import { theme } from '../../styles/theme';
import { cn } from '../../utils/cn';

interface TopicSelectorProps {
  topics: Topic[];
  selected: string | null;
  onChange: (topic: Topic) => void;
}

export default function TopicSelector({ topics, selected, onChange }: TopicSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto p-4 custom-scrollbar">
      {topics.map((topic) => (
        <motion.button
          key={topic.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={theme.spring}
          onClick={() => onChange(topic)}
          className={cn(
            "p-4 rounded-2xl text-left font-bold transition-all border-2",
            selected === topic.id
              ? "bg-primary text-white border-primary shadow-lg shadow-primary/30"
              : "bg-white text-text-dark border-transparent hover:border-primary/30 shadow-sm"
          )}
        >
          {topic.title}
        </motion.button>
      ))}
    </div>
  );
}
