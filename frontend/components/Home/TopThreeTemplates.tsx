"use client"

import { IFullTemplate, ITemplate, readMeGenerator } from "@/openAPI/generated"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"

import { api } from "@/lib/apiWrapper"
import Card from "@/components/SelectTemplate/Card"

const TopThreeTemplates = () => {
  const templateMaps = useQuery({
    queryKey: ["getV1Template"],
    queryFn: async () => {
      let request = await api.sidebar.getV1SidebarAll()

      return request.responseObject?.slice(0, 3) as IFullTemplate[]
    },
    staleTime: Infinity, // seeded once at backend boot, static for its lifetime
  })

  if (templateMaps.data && templateMaps.isSuccess) {
    return (
      <div>
        <div className="mb-10 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
            Try them out
          </p>
          <h2 className="mt-2 font-display text-4xl font-semibold text-foreground md:text-5xl">
            Featured specimens
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {templateMaps.data?.map((template: ITemplate, index: number) => (
            <motion.div
              initial={{ y: index % 2 === 0 ? 200 : -200, opacity: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5 }}
              whileInView={{ opacity: 1, y: 0 }}
              key={index}
            >
              <Card cardData={template} key={index} />
            </motion.div>
          ))}
        </div>
      </div>
    )
  } else {
    return <></>
  }
}

export default TopThreeTemplates
