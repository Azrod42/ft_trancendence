"use client"

import { useMutation } from 'react-query';
import { useForm, SubmitHandler } from 'react-hook-form';
import Api from "../../api/api";


type FormValues = {
	text: string;
};
async function sendApiMessage({ text }: { text: string }) {
	console.log("Tout debut\n");
	try {
	const response = await Api.post<{message: string}, {text: string}>({
		url: '/api/sendMessage',
		data: {
		text
		}
	});
	console.log("Tout debut apres\n");
	return response.data;
	} catch (error) {
	throw error;
	}
}

function MessageForm() {
  const { register, handleSubmit } = useForm<FormValues>();
  const mutation = useMutation(sendApiMessage);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    mutation.mutate(data);
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>
        Message:
        <textarea {...register('text')} required />
      </label>
      <input type="submit" value="Send" />
      {mutation.isLoading ? (
        "Sending message..."
      ) : mutation.isError ? (
        <div>An error occurred: {(mutation.error as Error).message}</div>
      ) : mutation.isSuccess ? (
        <div>Message sent successfully!</div>
      ) : null}
    </form>
  );
}

export default MessageForm;
