import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import TaskOutcomeMessage from './TaskOutcomeMessage';

describe('TaskOutcomeMessage', () => {
  const MESSAGE = 'Alpha Bravo Charlie Delta';

  it('should render the given message', () => {
    render(<TaskOutcomeMessage message={MESSAGE} setRefreshNotesForm={jest.fn()} onFinish={jest.fn()} />);
    expect(screen.getByText(MESSAGE)).toBeInTheDocument();
  });

  it('should click on the finish button', () => {
    const ON_FINISH = jest.fn();

    render(<TaskOutcomeMessage message={MESSAGE} setRefreshNotesForm={jest.fn()} onFinish={ON_FINISH} />);

    fireEvent.click(screen.getByText('Finish'));

    expect(ON_FINISH).toHaveBeenCalledTimes(1);
  });

  it('should set the notes refresh state variable', () => {
    const ON_REFRESH = jest.fn();

    render(<TaskOutcomeMessage message={MESSAGE} setRefreshNotesForm={ON_REFRESH} onFinish={jest.fn()} />);

    fireEvent.click(screen.getByText('Finish'));

    expect(ON_REFRESH).toHaveBeenCalledTimes(1);
  });
});
