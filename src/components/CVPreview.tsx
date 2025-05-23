import React from 'react';
import { CV, CVSectionVisibility } from '@/types/cv';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface CVPreviewProps {
  cv: CV;
  isAnonymised: boolean;
  sectionVisibility: CVSectionVisibility;
  sectionOrder: string[];
}

const CVPreview: React.FC<CVPreviewProps> = ({ 
  cv, 
  isAnonymised, 
  sectionVisibility,
  sectionOrder 
}) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    
    // If it's just a year
    if (dateString.length === 4) return dateString;
    
    // If it's YYYY-MM
    if (dateString.includes('-')) {
      const [year, month] = dateString.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1);
      return date.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
    }
    
    return dateString;
  };
  
  const renderContactInfo = () => {
    if (isAnonymised) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground">[Anonymised Contact Information]</p>
        </div>
      );
    }
    
    return (
      <div className="text-muted-foreground text-sm">
        {cv.email && <p>{cv.email}</p>}
        {cv.phone && <p>{cv.phone}</p>}
        {cv.location && (
          <p>
            {[cv.location.city, cv.location.country]
              .filter(Boolean)
              .join(', ')}
          </p>
        )}
        {cv.links && cv.links.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {cv.links.map((link, index) => (
              <a
                key={index}
                href={link.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {link.title || link.url}
              </a>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderSection = (sectionKey: string) => {
    if (!sectionVisibility[sectionKey as keyof CVSectionVisibility]) {
      return null;
    }

    switch (sectionKey) {
      case 'personalInfo':
        return (
          <div key={sectionKey} className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">
              {isAnonymised ? '[Anonymised Name]' : `${cv.firstName || ''} ${cv.surname || ''}`}
            </h1>
            <h2 className="text-xl text-muted-foreground">{cv.headline}</h2>
            {renderContactInfo()}
          </div>
        );
      
      case 'profileStatement':
        return cv.profileStatement ? (
          <div key={sectionKey} className="mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">Professional Summary</h3>
            <p className="text-muted-foreground">{cv.profileStatement}</p>
          </div>
        ) : null;
      
      case 'skills':
        return cv.skills && cv.skills.length > 0 ? (
          <div key={sectionKey} className="mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {cv.skills.map((skill, index) => (
                <Badge 
                  key={index} 
                  variant={skill.skillType === 'hard' ? 'default' : 'secondary'}
                  className={cn(
                    "bg-primary/10 text-primary hover:bg-primary/20",
                    skill.skillType === 'soft' && "bg-secondary/10 text-secondary hover:bg-secondary/20"
                  )}
                >
                  {skill.name} {skill.proficiency && `• ${skill.proficiency}`}
                </Badge>
              ))}
            </div>
          </div>
        ) : null;
      
      case 'experience':
        return cv.experience && cv.experience.length > 0 ? (
          <div key={sectionKey} className="mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-3">Work Experience</h3>
            {cv.experience.map((exp, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-foreground">{exp.title}</h4>
                    <p className="text-muted-foreground">{isAnonymised ? '[Confidential]' : exp.company}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(exp.start)} - {exp.current ? 'Present' : formatDate(exp.end)}
                  </p>
                </div>
                {exp.summary && <p className="text-muted-foreground mt-1">{exp.summary}</p>}
                {exp.highlights && exp.highlights.length > 0 && (
                  <ul className="list-disc pl-5 mt-2 text-muted-foreground">
                    {exp.highlights.map((highlight, idx) => (
                      <li key={idx}>{highlight}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ) : null;
      
      case 'achievements':
        return cv.achievements && cv.achievements.length > 0 ? (
          <div key={sectionKey} className="mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-3">Key Achievements</h3>
            <ul className="list-disc pl-5 text-muted-foreground">
              {cv.achievements.map((achievement, index) => (
                <li key={index}>{achievement}</li>
              ))}
            </ul>
          </div>
        ) : null;
      
      case 'education':
        return cv.education && cv.education.length > 0 ? (
          <div key={sectionKey} className="mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-3">Education</h3>
            {cv.education.map((edu, index) => (
              <div key={index} className="mb-3">
                <h4 className="font-medium text-foreground">{isAnonymised ? '[Confidential]' : edu.institution}</h4>
                {edu.location && !isAnonymised && (
                  <p className="text-muted-foreground text-sm">
                    {[edu.location.city, edu.location.country]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                )}
                {isAnonymised && edu.location && (
                  <p className="text-muted-foreground text-sm">[Anonymised Location]</p>
                )}
                {edu.qualifications && edu.qualifications.map((qual, idx) => (
                  <div key={idx} className="mt-1">
                    <p className="text-foreground">
                      {qual.qualification} in {qual.course}
                      {qual.grade && ` • ${qual.grade}`}
                    </p>
                    {qual.start && (
                      <p className="text-sm text-muted-foreground">
                        {formatDate(qual.start)} - {formatDate(qual.end)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : null;
      
      case 'languages':
        return cv.languages && cv.languages.length > 0 ? (
          <div key={sectionKey} className="mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-3">Languages</h3>
            <div className="flex flex-wrap gap-3">
              {cv.languages.map((lang, index) => (
                <Badge 
                  key={index}
                  variant="secondary"
                  className="bg-secondary/10 text-secondary hover:bg-secondary/20"
                >
                  {lang.name} {lang.level && `• ${lang.level}`}
                </Badge>
              ))}
            </div>
          </div>
        ) : null;
      
      case 'certifications':
        return cv.certifications && cv.certifications.length > 0 ? (
          <div key={sectionKey} className="mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-3">Certifications</h3>
            {cv.certifications.map((cert, index) => (
              <div key={index} className="mb-2">
                <p className="text-foreground font-medium">{cert.name}</p>
                <p className="text-sm text-muted-foreground">
                  {cert.issuer && isAnonymised ? '[Confidential]' : cert.issuer}
                  {cert.issuer && ` • `}
                  {cert.date && formatDate(cert.date)}
                </p>
              </div>
            ))}
          </div>
        ) : null;
      
      case 'publications':
        return cv.publications && cv.publications.length > 0 ? (
          <div key={sectionKey} className="mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-3">Publications</h3>
            {cv.publications.map((pub, index) => (
              <div key={index} className="mb-2">
                <p className="text-foreground">
                  {pub.pubType && `[${pub.pubType}] `}
                  {pub.title}
                </p>
                {pub.date && <p className="text-sm text-muted-foreground">{formatDate(pub.date)}</p>}
              </div>
            ))}
          </div>
        ) : null;
      
      case 'professionalMemberships':
        return cv.professionalMemberships && cv.professionalMemberships.length > 0 ? (
          <div key={sectionKey} className="mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-3">Professional Memberships</h3>
            {cv.professionalMemberships.map((mem, index) => (
              <p key={index} className="text-foreground mb-1">
                {mem.name}, {isAnonymised ? '[Confidential]' : mem.institution}
              </p>
            ))}
          </div>
        ) : null;
      
      case 'additionalDetails':
        return cv.addDetails && cv.addDetails.length > 0 ? (
          <div key={sectionKey} className="mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-3">Additional Information</h3>
            <ul className="list-disc pl-5 text-muted-foreground">
              {cv.addDetails.map((detail, index) => (
                <li key={index}>{detail}</li>
              ))}
            </ul>
          </div>
        ) : null;
      
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {sectionOrder.map(renderSection)}
    </div>
  );
};

export default CVPreview;
