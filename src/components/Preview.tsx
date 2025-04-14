import React from 'react';
import { useCVContext } from '@/contexts/CVContext';
import { cn } from '@/lib/utils';
import type { CV } from '@/types/cv';

export const Preview: React.FC = () => {
  const { cv } = useCVContext();

  if (!cv) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No CV data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Profile Statement */}
      {cv.profileStatement && (
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Profile Statement</h2>
          <p className="text-muted-foreground">{cv.profileStatement}</p>
        </section>
      )}

      {/* Skills */}
      {cv.skills && cv.skills.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {cv.skills.map((skill, index) => (
              <span
                key={index}
                className={cn(
                  "px-3 py-1 rounded-full text-sm",
                  "bg-primary/10 text-primary"
                )}
              >
                {skill.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {cv.experience && cv.experience.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Experience</h2>
          {cv.experience.map((exp, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{exp.title || exp.company}</h3>
                  <p className="text-muted-foreground">{exp.company}</p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {exp.start} - {exp.current ? 'Present' : exp.end}
                </div>
              </div>
              {exp.summary && <p className="text-sm">{exp.summary}</p>}
              {exp.highlights && exp.highlights.length > 0 && (
                <ul className="list-disc list-inside text-sm space-y-1">
                  {exp.highlights.map((highlight, i) => (
                    <li key={i}>{highlight}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {cv.education && cv.education.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Education</h2>
          {cv.education.map((edu, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{edu.institution}</h3>
                  {edu.qualifications && edu.qualifications.length > 0 && (
                    <p className="text-muted-foreground">
                      {edu.qualifications.map(q => q.qualification).filter(Boolean).join(', ')}
                    </p>
                  )}
                </div>
                {edu.qualifications && edu.qualifications[0] && (
                  <div className="text-sm text-muted-foreground">
                    {edu.qualifications[0].start} - {edu.qualifications[0].end}
                  </div>
                )}
              </div>
              {edu.qualifications && edu.qualifications.map((qual, i) => (
                <div key={i} className="text-sm">
                  <p>{qual.course}</p>
                  {qual.grade && <p className="text-muted-foreground">Grade: {qual.grade}</p>}
                </div>
              ))}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}; 