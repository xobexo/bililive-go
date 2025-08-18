import React from "react";
import React from "react";
let Editor: any;
let prismHighlight: any;
let prismLanguages: any;
import API from '../../utils/api';
import { Button } from "antd";
import './config-info.css';
const api = new API();

interface Props {

}

interface IState {
  config: any
}

class ConfigInfo extends React.Component<Props, IState> {

  constructor(props: Props) {
    super(props);
    this.state = {
      config: null,
    }
  }

  async componentDidMount(): Promise<void> {
    if (!Editor) {
      const mod = await import(/* webpackChunkName: "code-editor" */ 'react-simple-code-editor');
      Editor = mod.default || mod;
    }
    if (!prismHighlight || !prismLanguages) {
      const prism = await import(/* webpackChunkName: "prismjs" */ 'prismjs');
      await import('prismjs/components/prism-clike');
      await import('prismjs/components/prism-javascript');
      await import('prismjs/themes/prism.css');
      prismHighlight = prism.highlight;
      prismLanguages = prism.languages;
    }
    api.getConfigInfo()
      .then((rsp: any) => {
        this.setState({
          config: rsp.config
        });
      })
      .catch(err => {
        alert("获取配置信息失败");
      });
  }

  /**
     * 保存设置至config文件
     */
  onSettingSave = () => {
    api.saveRawConfig({ config: this.state.config })
      .then((rsp: any) => {
        if (rsp.err_no === 0) {
          alert("设置保存成功");
        } else {
          alert(`Server Error!\n${rsp.err_msg}`);
        }
      })
      .catch(err => {
        alert("设置保存失败！");
      })
  }

  render() {
    if (this.state.config === null) {
      return <div>loading...</div>;
    }
    return <div>
      {Editor ? (
      <Editor
        value={this.state.config}
        onValueChange={code => this.setState({ config: code })}
        highlight={code => prismHighlight(code, prismLanguages.js, "js")}
        padding={10}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 12,
        }}
      />) : (<div>Loading editor...</div>)}
      <Button
        type="default"
        style={{
          marginTop: 16,
        }}
        onClick={this.onSettingSave}
      >
        保存设置
      </Button>
    </div>
  }
}

export default ConfigInfo;