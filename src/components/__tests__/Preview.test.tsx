import { render, screen } from '@testing-library/react';
import { Preview } from '@/components/Preview';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';

// Mock the CV context
const mockCVContext = {
  cv: {
    profileStatement: 'Test profile statement',
    skills: [
      { name: 'Skill 1', proficiency: 'Advanced', skillType: 'hard' },
      { name: 'Skill 2', proficiency: 'Intermediate', skillType: 'soft' }
    ],
    experience: [
      {
        title: 'Test Role',
        company: 'Test Company',
        start: '2020-01',
        end: '2021-01',
        current: false,
        summary: 'Test summary',
        highlights: ['Test highlight 1', 'Test highlight 2']
      },
    ],
    education: [
      {
        institution: 'Test University',
        location: null,
        qualifications: [
          {
            qualification: 'Test Degree',
            course: 'Test Course',
            start: '2015-09',
            end: '2019-06',
            grade: 'First Class'
          }
        ]
      },
    ],
  },
  setCV: jest.fn(),
};

// Mock the CVContext
jest.mock('@/contexts/CVContext', () => ({
  useCVContext: () => mockCVContext,
  // Simple identity function that passes children through
  CVProvider: ({ children }) => children
}));

describe('Preview Component', () => {
  const renderPreview = () => {
    return render(
      <BrowserRouter>
        <Preview />
      </BrowserRouter>
    );
  };

  it('renders the profile statement', () => {
    renderPreview();
    expect(screen.getByText('Test profile statement')).toBeInTheDocument();
  });

  it('renders skills section', () => {
    renderPreview();
    expect(screen.getByText('Skill 1')).toBeInTheDocument();
    expect(screen.getByText('Skill 2')).toBeInTheDocument();
  });

  it('renders experience section', () => {
    renderPreview();
    expect(screen.getByText('Test Role')).toBeInTheDocument();
    expect(screen.getByText('Test Company')).toBeInTheDocument();
    expect(screen.getByText('Test summary')).toBeInTheDocument();
    expect(screen.getByText('Test highlight 1')).toBeInTheDocument();
    expect(screen.getByText('Test highlight 2')).toBeInTheDocument();
  });

  it('renders education section', () => {
    renderPreview();
    expect(screen.getByText('Test University')).toBeInTheDocument();
    expect(screen.getByText('Test Degree')).toBeInTheDocument();
    expect(screen.getByText('Test Course')).toBeInTheDocument();
    expect(screen.getByText('Grade: First Class')).toBeInTheDocument();
  });
}); 