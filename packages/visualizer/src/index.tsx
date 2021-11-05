import React, {
  FormEvent,
  Suspense,
  useEffect,
  useState,
  createContext,
  useContext,
} from "react"
import ReactDOM from "react-dom"
import { RecoilRoot, useRecoilState, useRecoilValue } from "recoil"
import {
  Spinner,
  Navbar as BPNavbar,
  Alignment,
  Classes,
  Drawer,
  FormGroup,
  InputGroup,
  TextArea,
  Button,
  Intent,
  Toaster,
  IToaster,
} from "@blueprintjs/core"
import emailjs from "emailjs-com"

import Workspace from "./Workspace"
import { workspaceOptionsState, Theme } from "./state"
import "./styles/main.css"

export const AppContext = createContext<{ toast: IToaster }>(undefined!)

const toast = Toaster.create()

const Navbar = ({
  onOpenFeedbackFormDrawer: handleOpenFeedbackFormDrawer,
}: {
  onOpenFeedbackFormDrawer: () => void
}) => {
  /* eslint-disable @typescript-eslint/no-unused-vars */

  const [{ theme }, setWorkspaceOptions] = useRecoilState(workspaceOptionsState)

  return (
    <BPNavbar>
      <BPNavbar.Group>
        <BPNavbar.Heading>
          <h3 className="font-semibold">ERML Visualizer</h3>
        </BPNavbar.Heading>
      </BPNavbar.Group>
      <BPNavbar.Group align={Alignment.RIGHT}>
        {/* TODO: Support dark mode for diagram viewer */}
        {/* <span
          onClick={handleThemeIconClick}
          className="font-semibold cursor-pointer hover:opacity-80"
        >
          {theme === Theme.DARK ? Theme.LIGHT : Theme.DARK}
        </span>
        <BPNavbar.Divider /> */}

        {/* eslint-disable jsx-a11y/anchor-is-valid */}
        <a onClick={handleOpenFeedbackFormDrawer}>Submit Feedback</a>
        <BPNavbar.Divider />
        <a href="https://erml.netlify.app/" target="_blank" rel="noreferrer">
          ERML
        </a>
        <BPNavbar.Divider />
        <a
          href="https://github.com/obadakhalili/erml/"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
      </BPNavbar.Group>
    </BPNavbar>
  )

  function handleThemeIconClick() {
    setWorkspaceOptions((options) => ({
      ...options,
      theme: options.theme === Theme.DARK ? Theme.LIGHT : Theme.DARK,
    }))
  }
}

const FeedbackForm = () => {
  const [formFields, setFormFields] = useState<{
    senderName: string
    feedback: string
  }>({ senderName: "", feedback: "" })
  const [isFeedbackSending, setIsFeedbackSending] = useState(false)
  const { toast } = useContext(AppContext)

  return (
    <form className="pt-6 px-4" onSubmit={submitFeedback}>
      <FormGroup label="Your Name" labelInfo="*">
        <InputGroup
          value={formFields.senderName}
          onChange={updateForm("senderName")}
        />
      </FormGroup>
      <FormGroup label="Your Feedback" labelInfo="*">
        <TextArea
          value={formFields.feedback}
          onChange={updateForm("feedback")}
          className="w-full"
        />
      </FormGroup>
      <Button type="submit" intent={Intent.PRIMARY} loading={isFeedbackSending}>
        Submit
      </Button>
    </form>
  )

  function updateForm(field: "senderName" | "feedback") {
    return (event: any) =>
      setFormFields(() => ({
        ...formFields,
        [field]: event.target.value,
      }))
  }

  async function submitFeedback(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      if (formFields.senderName === "" || formFields.feedback === "") {
        throw { text: "Name and Email are required" }
      }

      setIsFeedbackSending(true)

      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE as string,
        import.meta.env.VITE_EMAILJS_TEMPLATE as string,
        formFields,
        import.meta.env.VITE_EMAILJS_USER as string
      )
      toast.show({ message: "Feedback sent", intent: Intent.SUCCESS })
    } catch (error) {
      toast.show({
        message: (error as { text: string }).text,
        intent: Intent.DANGER,
      })
    } finally {
      setIsFeedbackSending(false)
    }
  }
}

const App = () => {
  const { theme } = useRecoilValue(workspaceOptionsState)
  const [isFeedbackFormDrawerOpen, setIsFeedbackFormDrawerOpen] =
    useState(false)

  useEffect(
    () =>
      document.body.classList[theme === Theme.DARK ? "add" : "remove"](
        Classes.DARK
      ),
    [theme]
  )

  return (
    <AppContext.Provider value={{ toast }}>
      <Navbar onOpenFeedbackFormDrawer={handleFeedbackFormDrawerToggle} />
      <Drawer
        title="We Appreciate Your Feedback"
        isOpen={isFeedbackFormDrawerOpen}
        onClose={handleFeedbackFormDrawerToggle}
      >
        <FeedbackForm />
      </Drawer>
      <Workspace />
    </AppContext.Provider>
  )

  function handleFeedbackFormDrawerToggle() {
    setIsFeedbackFormDrawerOpen(!isFeedbackFormDrawerOpen)
  }
}

const SuspenseFallback = (
  <div className="h-screen flex justify-center">
    <Spinner />
  </div>
)

ReactDOM.render(
  <RecoilRoot>
    <Suspense fallback={SuspenseFallback}>
      <App />
    </Suspense>
  </RecoilRoot>,
  document.getElementById("root")
)
