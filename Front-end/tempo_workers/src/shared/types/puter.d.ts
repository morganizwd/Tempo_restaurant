declare namespace Puter {
  namespace ai {
    interface Txt2ImgOptions {
      model?: string;
      quality?: 'low' | 'medium' | 'high' | 'hd' | 'standard';
    }

    function txt2img(
      prompt: string,
      options?: Txt2ImgOptions
    ): Promise<HTMLImageElement>;
  }
}

interface Window {
  puter: {
    ai: {
      txt2img: (
        prompt: string,
        options?: Puter.ai.Txt2ImgOptions
      ) => Promise<HTMLImageElement>;
    };
  };
}

