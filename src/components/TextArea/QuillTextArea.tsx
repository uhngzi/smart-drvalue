import { useEffect, useMemo, useRef } from 'react';
import ReactQuill, { DeltaStatic, EmitterSource } from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

import styled from 'styled-components';

interface Props {
  value: string;
  setValue: (value: string) => void;

  length?: number;
  setLength?: (length: number) => void;

  placeholder?: string;
  height?: string;
}

const formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'align',
  'blockquote',
  'list',
  'indent',
  'background',
  'color',
  'link',
  'image',
  'video',
];

const toolbarOptions = [
  [{ header: [1, 2, 3, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ color: [] }, { background: [] }],
  [{ align: [] }],
];

const QuillTextArea: React.FC<Props> = ({
  value,
  setValue,

  length,
  setLength,

  placeholder = '내용을 입력해주세요',
  height = '43px',
}) => {
  const quillRef = useRef<any>(null);

  useEffect(() => {
    const handleImage = () => {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/*');
      input.click();
      input.onchange = async () => {
        if (!input.files) {
          return;
        }

        const file = input.files;

        const range = quillRef.current.getEditor().getSelection(true);

        quillRef.current
          .getEditor()
          .insertEmbed(range.index, 'image', `/images/loading.gif`);

        try {
          //...
        } catch (e) {
          quillRef.current.getEditor().deleteText(range.index, 1);
        }
      };
    };

    if (quillRef.current) {
      const toolbar = quillRef.current.getEditor().getModule('toolbar');
      toolbar.addHandler('image', handleImage);
    }
  }, []);

  const modules = useMemo(() => {
    return {
      toolbar: {
        container: toolbarOptions,
      },
    };
  }, []);

  const onChange = (
    value: string,
    delta: DeltaStatic,
    source: EmitterSource,
    editor: ReactQuill.UnprivilegedEditor,
  ) => {
    if (editor.getLength() > 1000) {
      quillRef.current.getEditor().deleteText(1000, editor.getLength());
    } else {
      setValue(value);
    }

    if (setLength) {
      setLength(editor.getLength() - 1);
    }
  };

  return (
    <QuillTextAreaStyled
      $height={height}
    >
      <ReactQuill
        ref={quillRef}
        value={value}
        onChange={onChange}
        theme="snow"
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        preserveWhitespace
      />
      {setLength && <div className="h-center gap-2 justify-end text-12 text-[#555555] p-10">
        <p className="font-[Pretendard-Medium] text-[#246beb]">{length}</p>
        <p>/1000</p>
      </div>}
    </QuillTextAreaStyled>
  );
};

const QuillTextAreaStyled = styled.div<{
  $height: string;
}>`
  .ql-toolbar {
    border-color: #d2d2d2;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
  }

  .ql-container {
    min-height: ${({ $height }) => $height};
    border-color: #d2d2d2;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;

    /* Update the following styles */
    white-space: normal; /* 기본 줄바꿈 설정 */
    word-wrap: break-word; /* 단어 내 줄바꿈 */
    word-break: break-all; /* 모든 문자 줄바꿈 허용 */
  }
`;

export default QuillTextArea;
