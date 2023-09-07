import React, { useState, useEffect } from "react";
import "./index.scss";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import Underline from "@tiptap/extension-underline";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import {
  EditorProvider,
  FloatingMenu,
  BubbleMenu,
  useEditor,
  EditorContent,
  JSONContent,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { uploadFile } from "@/services/util";
import api from "@/services/api";
import { ResultProps } from "@/interface/Common";
import { message } from "@/hooks/EscapeAntd";

interface EditorProps {
  initData: any;
  isEdit: boolean;
  taskKey?: string;
  executor?: string;
  bookKey?: string;
}
const Editor = forwardRef((props: EditorProps, ref) => {
  const { initData, isEdit, executor, taskKey, bookKey } = props;

  const dispatch = useDispatch();

  const extensions = [
    StarterKit,
    Placeholder.configure({
      placeholder: ({ node }) => {
        const placeholderTitle = "请输入标题";
        const placeholderStr = "请输入内容,或输入'/'选择";
        console.log(node);
        if (node.type.name === "heading") {
          return placeholderTitle;
        } else if (node.type.name === "paragraph") {
          return placeholderStr;
        } else {
          return placeholderTitle;
        }
      },
    }),
    Image.configure({
      inline: true,
    }),
    Underline,
    TaskList,
    TaskItem.configure({
      nested: true,
    }),
    // Slash.configure({
    //   suggestion: slashSuggestion,
    // }),
    Table.configure({
      resizable: true,
    }),
    TableRow,
    TableHeader,
    TableCell,
    Link,
  ];
  // Dot.configure({
  //   suggestion: dotSuggestion,
  // }),
  // Dot.configure({
  //   suggestion: slashSuggestion,
  // }),
  // BubbleMenu.configure({
  //   element: document.querySelector(".menu"),
  // }),];
  const content = {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 2 },
      },
      {
        type: "paragraph",
        content: [],
      },
    ],
  };
  const editor = useEditor({
    extensions,
    content,
    editable: isEdit,
    onUpdate: ({ editor }) => {
      // if (!updateState.value) {
      //   store.commit("common/setUpdateState", true);
      // }
      // if (editContent.value) {
      //   store.commit("message/updateEditContent", { detail: editor.getJSON() });
      // }
      // if (type) {
      //   localStorage.setItem("detail", JSON.stringify(editor.getJSON()));
      // }
    },
    onCreate: ({ editor }) => {
      if (initData) {
        editor.commands.setContent(initData);
        editor.setEditable(isEdit);
        editor.commands.focus();
        // countTaskNum(initData.detail);
        // store.commit("message/setEditor", editor);
      } else {
        editor.commands.clearContent();

        editor.commands.setContent({
          type: "doc",
          content: [
            {
              type: "heading",
              attrs: { level: 2 },
            },
          ],
        });
      }
      editor.commands.focus();
    },
    onDestroy: () => {
      console.log("?????");
    },
    editorProps: {
      handleDOMEvents: {
        paste(view, event: ClipboardEvent) {
          if (event.clipboardData && event.clipboardData.files.length) {
            const text = event.clipboardData?.getData("text/plain");
            if (text) {
              console.log(text);
              return false;
            }
            event.preventDefault();
            const { schema } = view.state;
            const files = event.clipboardData.files;
            for (let index = 0; index < files.length; index++) {
              const file = files[index];
              if (file.type.includes("image/")) {
                let mimeType = ["image/png", "image/jpeg", "image/svg+xml"];
                uploadFile(file, mimeType, (url: string) => {
                  const node = schema.nodes.image.create({
                    src: url,
                  });
                  const transaction = view.state.tr.replaceSelectionWith(node);
                  view.dispatch(transaction);
                });
                // uploadImg(qiniuToken.value || "", file).then((url) => {
                //   const node = schema.nodes.image.create({
                //     src: url,
                //   });
                //   const transaction = view.state.tr.replaceSelectionWith(node);
                //   view.dispatch(transaction);
                // });
              } else {
                return false;
              }
            }
            return true;
          } else {
            return false;
          }
        },
        drop(view, event: DragEvent) {
          if (event.dataTransfer && event.dataTransfer.files.length) {
            event.preventDefault();
            const { schema } = view.state;
            const files = event.dataTransfer.files;
            for (let index = 0; index < files.length; index++) {
              const file = files[index];
              let mimeType = ["image/png", "image/jpeg", "image/svg+xml"];
              uploadFile(file, mimeType, (url: string) => {
                const node = schema.nodes.image.create({
                  src: url,
                });
                const transaction = view.state.tr.replaceSelectionWith(node);
                view.dispatch(transaction);
              });
            }
            return true;
          } else {
            return false;
          }
        },
        // click(this: any, view, event: MouseEvent) {
        //   event.stopPropagation();
        //   //@ts-ignore
        //   if (event.target.nodeName === "IMG") {
        //     imgVisible.value = true;
        //     //@ts-ignore
        //     imgSrc.value = event.target.src;
        //   }
        //   return false;
        // },
      },
    },
  });
  useEffect(() => {
    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, []);
  const handlePost = async (
    callback?: any,
    clear?: boolean,
    noMessage?: boolean
  ) => {
    if (!editor) return;
    const json: JSONContent = editor.getJSON();
    let title: string | undefined = "新任务";
    if (json.content) {
      if (
        json.content[0] &&
        json.content[0].content &&
        json.content[0].content[0]
      ) {
        title = json.content[0].content[0].text;
        if (!title) {
          // ElMessage.error("Please Enter Title");
          // return;
          json.content[0] = {
            attrs: { level: 2 },
            content: [{ type: "text", text: "新任务" }],
            type: "heading",
          };
        } else {
          json.content[0] = {
            attrs: { level: 2 },
            content: [{ type: "text", text: title }],
            type: "heading",
          };
        }
      } else {
        json.content.unshift({
          attrs: { level: 2 },
          content: [{ type: "text", text: "新任务" }],
          type: "heading",
        });
      }
      console.log(json.content);
      let arr = json.content;
      let cover = "";
      for (let i = 0; i < arr.length; i++) {
        let item = arr[i];
        console.log(item.type);
        if (item.type === "image") {
          cover = item.attrs?.src;
          break;
        } else if (item.type === "paragraph" && Array.isArray(item.content)) {
          for (let j = 0; j < item.content.length; j++) {
            if (item.content[j].type === "image") {
              cover = item.content[j].attrs?.src;
              break;
            }
          }
        }
      }
      const summary = editor
        .getText()
        .replace(title as string, "")
        .replace(/\r\n/g, "")
        .replace(/\n/g, "")
        .substring(0, 200);

      // if (props.initData) {
      //   // 有初始数据，更新数据
      //   store.dispatch("card/editCard", {
      //     cardKey: props.initData._key,
      //     title,
      //     content: json,
      //     summary,
      //   });
      // } else {
      // 创建数据
      // store.dispatch("card/addCard", { title, content: json, summary });
      // countTaskNum(json.content);

      if (taskKey) {
        const postRes = (await api.request.patch("task", {
          taskKey,
          title,
          content: json.content,
          summary,
        })) as ResultProps;
        if (postRes.msg === "OK") {
          if (!noMessage) {
            message.success("编辑任务成功");
          }
          callback(postRes);
        }
      } else {
        const postRes = (await api.request.post("task", {
          bookKey,
          title,
          content: json.content,
          executor,
          summary,
        })) as ResultProps;
        if (postRes.msg === "OK") {
          console.log(JSON.stringify(json.content));
          if (!noMessage) {
            message.success("创建任务成功");
          }
          callback(postRes);
        }
      }

      if (!clear) {
        editor.commands.clearContent();
        editor.commands.focus();
      }
      // }
    }
  };
  useImperativeHandle(ref, () => {
    return {
      handlePost: handlePost,
    };
  });
  return (
    <>
      {editor ? (
        <>
          <EditorContent editor={editor} />
          <FloatingMenu>This is the floating menu</FloatingMenu>

          <BubbleMenu
            editor={editor}
            tippy-options={{ duration: 100 }}
            className="menu dp--center"
          >
            {/* <div className="button dp--center" onClick={()=>{insertNode('bold')}}>
      <icon-font name="bold" />
    </div>
    <div className="button dp--center" onClick={()=>{insertNode('italic')}}>
      <icon-font name="italic" />
    </div>
    <div className="button dp--center" onClick={()=>{insertNode('strike')}}>
      <icon-font name="strike" />
    </div>
    <div className="button dp--center" onClick={()=>{insertNode('underline')}}>
      <icon-font name="underline" />
    </div>
    <div onClick={()=>{insertNode('text')}} className="button dp--center">
      <icon-font name="text" />
    </div>
    <div onClick={()=>{insertNode('h1')}} className="button dp--center">
      <icon-font name="h1" />
    </div>
    <div onClick={()=>{insertNode('h2')}} className="button dp--center">
      <icon-font name="h2" />
    </div>
    <div onClick={()=>{insertNode('h3')}} className="button dp--center">
      <icon-font name="h3" />
    </div>
    <div onClick={()=>{insertNode('link')}} className="button dp--center">
      <icon-font name="link" />
    </div>
    <div onClick={()=>{insertNode('progress')}} className="button dp--center">
      <icon-font name="progress" />
    </div>
    <div onClick={()=>{insertNode('star')}} className="button dp--center">
      <icon-font name="star" />
    </div>
    <div onClick={()=>{insertNode('bulletList')}} className="button dp--center">
      <icon-font name="bulletList" />
    </div>
    <div onClick={()=>{insertNode('orderList')}} className="button dp--center">
      <icon-font name="orderList" />
    </div>
    <div onClick={()=>{insertNode('taskList')}} className="button dp--center">
      <icon-font name="taskList" />
    </div>
    <div onClick={()=>{insertNode('divider')}} className="button dp--center">
      <icon-font name="divider" />
    </div>
    <div onClick={()=>{insertNode('blockquote')}} className="button dp--center">
      <icon-font name="blockquote" />
    </div>
    <div onClick={()=>{insertNode('code')}} className="button dp--center">
      <icon-font name="code" />
    </div>
    <div onClick={()=>{insertNode('codeBlock')}} className="button dp--center">
      <icon-font name="codeBlock" /> 
    </div>*/}
          </BubbleMenu>
        </>
      ) : null}
    </>
  );
});
export default Editor;
