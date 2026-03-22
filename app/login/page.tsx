import { login, signup } from './actions';

/**
 * Renders a centered login/sign-up page titled "Masuk ke PreApply" with email and password inputs.
 *
 * The form includes required email and password fields and two submit buttons wired to external
 * `login` and `signup` form actions for authentication and account creation.
 *
 * @returns The component's JSX element representing the login/sign-up UI.
 */
export default function LoginPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">Masuk ke PreApply</h2>

        <form className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
              Email:
            </label>
            <input id="email" name="email" type="email" required className="text-gray-700 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none" />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
              Password:
            </label>
            <input id="password" name="password" type="password" required className="text-gray-700 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none" />
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <button formAction={login} className="rounded-md bg-blue-600 p-2 text-white hover:bg-blue-700">
              Log in
            </button>
            <button formAction={signup} className="rounded-md border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50">
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
