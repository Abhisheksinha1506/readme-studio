import { useEffect, useState } from "react"
import { IDefaultBlockInput, IFunction } from "@/openAPI/generated"
import { useQuery } from "@tanstack/react-query"
import { useDebounce } from "use-debounce"

import { api } from "@/lib/apiWrapper"

import CopyButton from "./CopyButton"
import DownloadButton from "./DownloadButton"
import Editor from "./Editor/Editor"
import Preview from "./Editor/Preview/Preview"
import RawText from "./Editor/RawText/RawText"
import MainContentTabs from "./Tabs/MainContentTabs"
import TabContent from "./Tabs/TabContent"
import ToggleViewButton from "./Tabs/ToggleViewButton"
import { EditModeOne, EditModeThree, EditModeTwo } from "./types"

// Quiet period after the last form change before the README is recompiled.
const COMPILE_DEBOUNCE_MS = 200

const MainContent: React.FC<{
  templateId: string
  templateBlocks: IFunction[]
  setTemplateBlocks: React.Dispatch<React.SetStateAction<IFunction[]>>
}> = ({ templateId, templateBlocks, setTemplateBlocks }) => {
  const [variables, setVariables] = useState<Record<string, any>>({})
  const [debouncedVariables] = useDebounce(variables, COMPILE_DEBOUNCE_MS)
  const [output, setOutput] = useState<string>("")

  const populateTemplateData = useQuery({
    queryKey: ["getV1TemplateTemplateDefaultBlocks", templateId],
    queryFn: async () => {
      let index = await api.template.getV1TemplateTemplateDefaultBlocks(
        templateId
      )

      return index.responseObject as IFunction[]
    },
    // "/generator" has no template to load: the user starts from an empty block list.
    enabled: templateId !== "undefined",
    // Templates are seeded once at backend boot and never change at runtime.
    staleTime: Infinity,
  })

  useEffect(() => {
    if (populateTemplateData.status === "success") {
      setTemplateBlocks(populateTemplateData.data!)
    }
  }, [populateTemplateData.data, populateTemplateData.status])

  // Rendering runs on the backend, which resolves each block's macro content
  // itself from (folder, function) identifiers rather than trusting template
  // source from the client. debouncedVariables is what keeps a request from
  // firing on every keystroke, same debounce window as before the move.
  const compileOutput = useQuery({
    queryKey: ["postV1TemplateCompile", templateBlocks, debouncedVariables],
    queryFn: async () => {
      const blocks: IDefaultBlockInput[] = templateBlocks.map(
        (block: IFunction) => ({
          function: block.function,
          folder: block.folder,
        })
      )

      const request = await api.template.postV1TemplateCompile({
        blocks,
        variables: debouncedVariables,
      })

      return request.responseObject as string
    },
    enabled: templateBlocks.length > 0,
  })

  useEffect(() => {
    if (compileOutput.status === "success") {
      setOutput(compileOutput.data!)
    }
  }, [compileOutput.data, compileOutput.status])

  const [numberOfViewsToShow, setNumberOfViewsToShow] = useState<number>(2)
  const [editMode, setEditMode] = useState<
    EditModeOne | EditModeTwo | EditModeThree
  >(EditModeTwo.EDIT_PREVIEW)

  return (
    <div className="flex flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 xl:gap-6 xl:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <ToggleViewButton
              numberOfViewsToShow={numberOfViewsToShow}
              setNumberOfViewsToShow={setNumberOfViewsToShow}
              setEditMode={setEditMode}
            />
            <MainContentTabs
              numberOfViewsToShow={numberOfViewsToShow}
              editMode={editMode}
              setEditMode={setEditMode}
            />
          </div>

          <div className="flex flex-wrap items-center justify-end gap-4">
            <CopyButton copiedText={output} />
            <DownloadButton downloadText={output} fileName={"README.md"} />
          </div>
        </div>

        {/* Content */}
        <TabContent
          numberOfViewsToShow={numberOfViewsToShow}
          editMode={editMode}
          Editor={
            <Editor
              templateBlocks={templateBlocks}
              setTemplateBlocks={setTemplateBlocks}
              variables={variables}
              setVariables={setVariables}
            />
          }
          Preview={<Preview output={output} />}
          RawText={<RawText output={output} />}
        />
      </main>
    </div>
  )
}

export default MainContent
