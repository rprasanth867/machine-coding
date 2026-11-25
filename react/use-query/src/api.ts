
export const getName = async () => {
  return new Promise<string>((res) => {
    setTimeout(() => {
      res("Prasanth Rudrakshula")
    }, 3000);
  })
}