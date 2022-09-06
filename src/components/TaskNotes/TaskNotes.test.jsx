import React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '../../__mocks__/keycloakMock';

import TaskNotes from './TaskNotes';

// mock useParams
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn().mockReturnValue({ businessKey: 'BUSINESS_KEY' }),
}));

describe('TaskNotes', () => {
  const mockAxios = new MockAdapter(axios);

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    mockAxios.reset();
  });

  it('should render the task notes form', async () => {
    await waitFor(() => render(<TaskNotes
      displayForm
      businessKey="ghi"
      setRefreshNotesForm={jest.fn()}
    />));
    expect(screen.queryByText('Add a new note')).toBeInTheDocument();
  });

  it('should not render the task notes form', async () => {
    await waitFor(() => render(<TaskNotes
      displayForm={false}
      businessKey="ghi"
      setRefreshNotesForm={jest.fn()}
    />));
    expect(screen.queryByText('Add a new note')).not.toBeInTheDocument();
  });

  it('should add a note on submit the form', async () => {
    const input = '\nthis \\is a "test" \nnote';
    const expectedPayload = '\\nthis \\\\is a \\"test\\" \\nnote';

    const { container } = await waitFor(() => render(<TaskNotes
      displayForm
      businessKey="ghi"
      setRefreshNotesForm={jest.fn()}
      setError={jest.fn()}
    />));

    // Type into the textarea...
    const textarea = container.getElementsByClassName('govuk-textarea')[0];
    fireEvent.change(textarea, { target: { name: 'note', value: input } });

    // ... and then click on the submit button.
    const submit = container.getElementsByClassName('hods-button')[0];
    await waitFor(() => userEvent.click(submit));

    const requestPayload = mockAxios.history.post[0].data;
    const parsedPayload = JSON.parse(requestPayload)[0].content;
    expect(parsedPayload).toEqual(expectedPayload);
  });

  it('should add multiple notes on multiple submit the form', async () => {
    const firstinput = '\nthis \\is a "test" \nnote';
    const secondinput = '\nthis \\is another "test" \nnote';
    const firstExpectedPayload = '\\nthis \\\\is a \\"test\\" \\nnote';
    const secondExpectedPayload = '\\nthis \\\\is another \\"test\\" \\nnote';

    const { container } = await waitFor(() => render(<TaskNotes
      displayForm
      businessKey="ghi"
      setRefreshNotesForm={jest.fn()}
      setError={jest.fn()}
    />));

    // Type into the textarea...
    let textarea = container.getElementsByClassName('govuk-textarea')[0];
    fireEvent.change(textarea, { target: { name: 'note', value: firstinput } });

    // ... and then click on the submit button.
    await waitFor(() => userEvent.click(container.getElementsByClassName('hods-button')[0]));

    // Type into the textarea again...
    textarea = container.getElementsByClassName('govuk-textarea')[0];
    fireEvent.change(textarea, { target: { name: 'note', value: secondinput } });

    // ... and then click on the submit button. again
    await waitFor(() => userEvent.click(container.getElementsByClassName('hods-button')[0]));

    const firstRequestPayload = mockAxios.history.post[0].data;
    const firstParsedPayload = JSON.parse(firstRequestPayload)[0].content;
    expect(firstParsedPayload).toEqual(firstExpectedPayload);

    const secondRequestPayload = mockAxios.history.post[1].data;
    const secondParsedPayload = JSON.parse(secondRequestPayload)[0].content;
    expect(secondParsedPayload).toEqual(secondExpectedPayload);
  });
});
