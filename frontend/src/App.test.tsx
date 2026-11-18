import {describe,it,expect} from 'vitest';
import {render,screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import App from './App';

describe('ResumeIQ UI',()=>{
  it('renders the landing page and primary call to action',()=>{
    render(<MemoryRouter><App/></MemoryRouter>);
    expect(screen.getByText(/Make your resume/i)).toBeInTheDocument();
    expect(screen.getByRole('link',{name:/Analyze my resume/i})).toBeInTheDocument();
  });
});
