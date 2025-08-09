import { useLocation } from "@tanstack/react-router";
import { useState, useEffect } from "react";

//
// Как эта хуйня работает (второй раз я такое не напишу):
// изначально наш стек содержит текуший ключ [k1]
// мы переходим на следующую страницу и делаем проверку
// если текущий ключ есть в стеке но он не последний, это значит что пользователь нажал кнопку назад
// поэтому мы меняем текущую позицию на позицию существующего ключа в стеке
// иначе если это новый путь, мы обрезаем стек до текущей позиции
// новый ключ добавляется в стек [k1, k2]
// и мы меняем текущую позицию на позицию нового ключа
// в конце мы проверяем, если текущуя позиция меньше чем последняя размер стека
//

export const useCanGoForward = () => {
  const location = useLocation();
  const [historyStack, setHistoryStack] = useState([
    location.state?.key || location.pathname,
  ]);
  const [currentPosition, setCurrentPosition] = useState(0);

  console.log(historyStack);

  useEffect(() => {
    const newKey = location.state?.key || location.pathname;

    const existingIndex = historyStack.indexOf(newKey);

    if (existingIndex !== -1 && existingIndex !== currentPosition) {
      setCurrentPosition(existingIndex);
    } else {
      const nextStack = historyStack.slice(0, currentPosition + 1);
      nextStack.push(newKey);
      setHistoryStack(nextStack);
      setCurrentPosition(nextStack.indexOf(newKey));
    }
  }, [location]);

  return currentPosition < historyStack.length - 1;
};
