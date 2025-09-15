import React, { useState, createContext, useContext, forwardRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Although we're not using react-router-dom, this is included in the original component
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

// These functions and components are typically from a UI library like shadcn/ui.
// For a single-file application, we must define them all here.

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// === Toast Components and Hooks ===
const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
};

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

const toastContext = createContext(null);

const useToast = () => {
  const context = useContext(toastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case actionTypes.DISMISS_TOAST:
      const { toastId } = action;
      if (toastId) {
        return {
          ...state,
          toasts: state.toasts.map((t) =>
            t.id === toastId ? { ...t, open: false } : t
          ),
        };
      }
      return {
        ...state,
        toasts: state.toasts.map((t) => ({ ...t, open: false })),
      };

    case actionTypes.REMOVE_TOAST:
      const { toastId: removeToastId } = action;
      if (removeToastId) {
        return {
          ...state,
          toasts: state.toasts.filter((t) => t.id !== removeToastId),
        };
      }
      return {
        ...state,
        toasts: [],
      };
    default:
      throw new Error("Unknown action type");
  }
};

const ToastProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, {
    toasts: [],
  });

  const [pausedAt, setPausedAt] = useState(undefined);
  const [mounts, setMounts] = useState(0);

  useEffect(() => {
    setMounts((m) => m + 1);
  }, []);

  useEffect(() => {
    if (pausedAt) {
      return;
    }
    if (state.toasts.length === 0) {
      return;
    }

    const toast = state.toasts[0];
    const timeout = setTimeout(() => {
      dispatch({
        type: actionTypes.DISMISS_TOAST,
        toastId: toast.id,
      });
    }, TOAST_REMOVE_DELAY);

    return () => {
      clearTimeout(timeout);
    };
  }, [state.toasts, pausedAt]);

  const addToast = (props) => {
    const id = genId();
    const toast = {
      ...props,
      id,
      open: true,
      dismiss: () => dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id }),
    };
    dispatch({
      type: actionTypes.ADD_TOAST,
      toast,
    });
    return {
      id: toast.id,
      dismiss: toast.dismiss,
      update: (newProps) =>
        dispatch({
          type: actionTypes.UPDATE_TOAST,
          toast: { id, ...newProps },
        }),
    };
  };

  const toast = (props) => {
    return addToast(props);
  };

  const value = {
    ...state,
    toast,
  };

  return (
    <toastContext.Provider value={value}>
      {children}
    </toastContext.Provider>
  );
};


const Toast = forwardRef(({ className, variant, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "group relative pointer-events-auto flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[state=closed]:animate-[toast-hide] data-[state=open]:animate-[toast-show] sm:pr-6",
        {
          "border-slate-200 bg-white text-slate-950 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50":
            variant === "default",
          "border-red-500 bg-red-600 text-white dark:border-red-500 dark:bg-red-600 dark:text-white":
            variant === "destructive",
        },
        className
      )}
      {...props}
    />
  );
});

const ToastTitle = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm font-semibold [&+div]:text-xs", className)}
    {...props}
  />
));

const ToastDescription = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
));

const ToastViewport = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:top-auto sm:bottom-0 sm:right-0 sm:flex-col md:max-w-[420px]", className)}
    {...props}
  />
));

const Toaster = () => {
  const { toasts } = useToast();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? (
    <ToastViewport>
      {toasts.map((toast) => {
        const { id, title, description, variant, ...props } = toast;
        return (
          <Toast key={id} variant={variant} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
          </Toast>
        );
      })}
    </ToastViewport>
  ) : null;
};

// === Simple UI Components (Input, Button, Label) ===
const Input = forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

const Button = forwardRef(({ className, variant, size, ...props }, ref) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

const Label = forwardRef(({ className, ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    />
  );
});

// === The Register Component (from the user's original code) ===
function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    re_password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.re_password) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const payload = {
      email: formData.email,
      username: formData.email,
      password: formData.password,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/users/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast({
          title: "Registration Successful!",
          description: "You have been registered. Please log in.",
        });
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        const data = await response.json();
        const errorMessage = Object.values(data).flat().join(", ") || "Registration failed";
        toast({
          title: "Registration Failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Network error. Is the server running?",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-900 p-8 md:p-10 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-black/30 mt-12 transition-all duration-300 font-sans">
      <h2 className="text-4xl font-extrabold mb-6 text-center text-gray-900 dark:text-gray-50 tracking-tight">
        Create Account
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        <div>
          <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="********"
            required
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        <div>
          <Label htmlFor="re_password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Confirm Password
          </Label>
          <Input
            id="re_password"
            type="password"
            name="re_password"
            value={formData.re_password}
            onChange={handleChange}
            placeholder="********"
            required
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-lg py-2 shadow-md hover:shadow-lg transition-all duration-200"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Creating...</span>
            </div>
          ) : (
            "Register"
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
          Log in
        </Link>
      </p>
    </div>
  );
}

// === Main App Component for single-file routing ===
function Login() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4">Login Page</h1>
      <p>This is a placeholder for the login page.</p>
      <Link to="/" className="mt-4 text-blue-600 dark:text-blue-400 hover:underline font-medium">
        Go to Register
      </Link>
    </div>
  );
}

const App = () => {
  const [route, setRoute] = useState("/");

  const navigate = (newRoute) => {
    setRoute(newRoute);
  };

  const routes = {
    "/": <Register key="register-page" />,
    "/login": <Login key="login-page" />,
  };

  const CurrentComponent = routes[route] || <div>404: Not Found</div>;
  
  // Custom context provider for the simplified router
  const RouterContext = createContext({ navigate });
  const useRoutes = () => useContext(RouterContext);

  // Custom hook to replace react-router-dom's useNavigate
  const useNavigateReplacement = () => {
    const { navigate: customNavigate } = useRoutes();
    return customNavigate;
  };
  
  // Custom Link component to work with the simplified router
  const LinkReplacement = ({ to, children, className }) => {
    const { navigate: customNavigate } = useRoutes();
    return (
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          customNavigate(to);
        }}
        className={className}
      >
        {children}
      </a>
    );
  };

  // Replace the original react-router-dom components with our simplified versions
  const RegisterWithCustomRouter = () => {
    const OriginalRegister = Register;
    const OriginalLink = Link;
    const OriginalUseNavigate = useNavigate;

    return (
      <RouterContext.Provider value={{ navigate }}>
        <OriginalRegister navigate={useNavigateReplacement()} Link={LinkReplacement} />
      </RouterContext.Provider>
    );
  };
  
  return (
    <ToastProvider>
      <style>
        {`
          @keyframes toast-show { from { transform: translateX(100%); } to { transform: translateX(0); } }
          @keyframes toast-hide { from { transform: translateX(0); } to { transform: translateX(100%); } }
          .dark .bg-gray-900 { background-color: #1a202c; }
          .dark .text-gray-50 { color: #f7fafc; }
          .dark .text-gray-300 { color: #e2e8f0; }
          .dark .text-gray-400 { color: #cbd5e0; }
          .dark .text-gray-500 { color: #a0aec0; }
          .dark .text-gray-800 { background-color: #2d3748; }
          .dark .border-gray-700 { border-color: #4a5568; }
          .dark .hover\\:bg-blue-600:hover { background-color: #4299e1; }
          .dark .shadow-black\\/30 { box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3), 0 2px 4px -1px rgba(0,0,0,0.3); }
          .dark .bg-red-950 { background-color: #2c0e0e; }
          .dark .text-red-300 { color: #fca5a5; }
        `}
      </style>
      <div className="bg-gray-50 dark:bg-gray-950 min-h-screen flex items-center justify-center p-4">
        <RouterContext.Provider value={{ navigate }}>
          {CurrentComponent}
        </RouterContext.Provider>
      </div>
      <Toaster />
    </ToastProvider>
  );
};

export default App;
