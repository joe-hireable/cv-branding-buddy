import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Edit, GripVertical } from 'lucide-react';
import { useDrag, useDrop, useDragDropManager } from 'react-dnd';
import { cn } from '@/lib/utils';

interface CVSectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
  isVisible: boolean;
  onVisibilityToggle: () => void;
  onEdit?: () => void;
  onOptimize?: () => void;
  isOptimizing?: boolean;
  index: number;
  moveSection: (dragIndex: number, hoverIndex: number) => void;
  isDraggable?: boolean;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

const CVSection: React.FC<CVSectionProps> = ({
  id,
  title,
  children,
  isVisible,
  onVisibilityToggle,
  onEdit,
  onOptimize,
  isOptimizing = false,
  index,
  moveSection,
  isDraggable = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const dragDropManager = useDragDropManager();
  const isDraggingAny = dragDropManager.getMonitor().isDragging();

  const ref = React.useRef<HTMLDivElement>(null);
  
  const [{ handlerId }, drop] = useDrop({
    accept: 'section',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current || !isDraggable) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveSection(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'section',
    item: () => {
      return { id, index, type: 'section' };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: () => isDraggable,
  });

  React.useEffect(() => {
    if (isDraggable) {
      drag(drop(ref.current));
    }
  }, [drag, drop, isDraggable]);

  return (
    <div
      ref={ref}
      className={cn(
        'mb-4 border rounded-md transition-all duration-200',
        isVisible ? '' : 'opacity-50',
        isDragging ? 'opacity-100 border-none bg-gradient-to-r from-[#F600FE] via-[#A136FF] to-[#0033D9] text-white shadow-lg' : '',
        isDraggingAny ? 'cursor-grabbing' : ''
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-handler-id={handlerId}
    >
      <div className="flex items-center p-4">
        {isDraggable && (
          <div className={`px-1 mr-2 ${isDraggingAny ? 'cursor-grabbing' : 'cursor-grab'}`}>
            <GripVertical className={cn("h-5 w-5", isDragging ? "text-white" : "text-gray-400")} />
          </div>
        )}
        <h3 className={cn("text-sm font-medium flex-1", isDragging && "text-white")}>{title}</h3>
        <div className="flex space-x-2">
          {onOptimize && !isDraggingAny && !isDragging && (
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={onOptimize}
              disabled={isOptimizing}
              data-testid="optimize-button"
            >
              {isOptimizing ? 'Optimizing...' : 'Optimize with AI'}
            </Button>
          )}
          {onEdit && !isDraggingAny && !isDragging && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="text-gray-500 hover:text-gray-700"
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          {!isDraggingAny && !isDragging && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onVisibilityToggle}
              className="text-gray-500 hover:text-gray-700"
            >
              {isVisible ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </div>
      {isVisible && !isDraggingAny && !isDragging && <div className="p-4">{children}</div>}
    </div>
  );
};

export default CVSection;
