import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { X, ArrowLeft } from "lucide-react"
import { ExerciseEntry } from "@/types/excercise-entry"

interface ExerciseLinkModalProps {
  exercise: ExerciseEntry | null
  onClose: () => void
  allExercises: ExerciseEntry[]
  isNested?: boolean
  onCloseAll?: () => void
  level?: number
}

export function ExerciseLinkModal({ 
  exercise, 
  onClose, 
  allExercises,
  isNested = false,
  onCloseAll,
  level = 0
}: ExerciseLinkModalProps) {
  const [nestedExercise, setNestedExercise] = React.useState<ExerciseEntry | null>(null);

  if (!exercise) return null

  const parseDefinition = (definition: string) => {
    const parts = definition.split(/(@\([^)]+\))/g);
    return parts.map((part, index) => {
      const match = part.match(/^@\(([^)]+)\)$/);
      if (match) {
        const exerciseName = match[1];
        const linkedExercise = allExercises.find(e => e.name === exerciseName);
        if (linkedExercise) {
          return (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setNestedExercise(linkedExercise);
              }}
              className="text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
            >
              {exerciseName}
            </button>
          );
        }
      }
      return part;
    });
  };

  const baseZIndex = 50;
  const zIndex = baseZIndex + (level * 2);

  return (
    <>
      <Dialog open={!!exercise}>
        <DialogContent 
          className="sm:max-w-lg" 
          showCloseButton={false}
          style={{ 
            zIndex: zIndex + 1,
            '--overlay-z-index': zIndex
          } as React.CSSProperties}
        >
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>{exercise.name}</DialogTitle>
              <div className="flex items-center gap-2">
                {isNested && (
                  <button
                    onClick={onClose}
                    className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span className="sr-only">Back</span>
                  </button>
                )}
                <button
                  onClick={onCloseAll || onClose}
                  className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </button>
              </div>
            </div>
          </DialogHeader>
          <DialogDescription className="sr-only">
            Exercise details for {exercise.name}
          </DialogDescription>
          <div className="flex flex-col space-y-4">
            <div className="text-sm text-muted-foreground">
              {parseDefinition(exercise.definition)}
            </div>
            {exercise.tags && (
              <div className="flex flex-wrap gap-2">
                {exercise.tags.split('|').map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}
            {exercise.aliases && (
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">AKA: </span>
                {exercise.aliases.split('|').map((alias, index, array) => (
                  <span key={index}>
                    {alias.trim()}
                    {index < array.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Nested Modal */}
      {nestedExercise && (
        <ExerciseLinkModal
          exercise={nestedExercise}
          onClose={() => setNestedExercise(null)}
          allExercises={allExercises}
          isNested={true}
          onCloseAll={onCloseAll || onClose}
          level={level + 1}
        />
      )}
    </>
  )
} 