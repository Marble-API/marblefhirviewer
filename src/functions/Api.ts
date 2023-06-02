export enum MethodEnum {
  Get = "GET",
  Post = "POST",
  Put = "PUT",
  Patch = "PATCH",
  Delete = "DELETE",
}

export const downloadFile = async (
  url: string,
  method: MethodEnum = MethodEnum.Get,
  body: any = null
): Promise<File | null> => {
  try {
    const response = await fetchStream(url, method, body);
    if (!(response instanceof Response)) {
      return new File([response.blob], response.fileName, {
        type: response.mimeType,
      });
    }
  } catch (e) {
    console.error(e);
  }
  return null;
};

const fetchStream = async (
  url: string,
  method: MethodEnum = MethodEnum.Get,
  body: any = null
) => {
  let headers: { [name: string]: string } = {};

  return await fetch(url, {
    method: method,
    headers: headers,
    body: body ? JSON.stringify(body) : null,
  })
    .then((response) => {
      if (response.ok) {
        const reader = response.body!.getReader();
        return {
          fileName: response.headers
            .get("content-disposition")
            ?.split(";")[1]
            .split("=")[1]
            ?.replaceAll(/\\|"/g, ""),
          mimeType: response.headers.get("content-type"),
          stream: new ReadableStream({
            start(controller) {
              return pump();

              function pump(): any {
                return reader.read().then(({ done, value }) => {
                  // When no more data needs to be consumed, close the stream
                  if (done) {
                    controller.close();
                    return;
                  }
                  // Enqueue the next data chunk into our target stream
                  controller.enqueue(value);
                  return pump();
                });
              }
            },
          }),
        };
      } else {
        return response;
      }
    })
    .then(async (i: any) => {
      if (i instanceof Response) {
        return i;
      } else {
        return { ...i, blob: await new Response(i.stream).blob() };
      }
    });
};
