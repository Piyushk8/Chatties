import { useRef,useCallback,useEffect,useState } from "react";
import toast from "react-hot-toast";


export const useAsyncMutation = (mutationHook) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [mutate] = mutationHook();

  const executeMutation = async (toastMessage, ...args) => {
    setIsLoading(true);
    const toastId = toast.loading(toastMessage || "Updating data...");

    try {
      const res = await mutate(...args);

      if (res.data) {
        toast.success(res?.data?.message || "Updated data successfully", {
          id: toastId,
        });
        setData(res.data);
      } else {
        toast.error(res?.error?.data?.message || "Error updating data", {
          id: toastId,
        });
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return [executeMutation, isLoading, data];
};


export const useSocketEvents = (socket, handlers) => {
  useEffect(() => {
    Object.entries(handlers).forEach(([event, handler]) => {
      if(socket) socket.on(event, handler);
    });

    return () => {
      Object.entries(handlers).forEach(([event, handler]) => {
        if(socket) socket.off(event, handler);
      });
    };
  }, [socket, handlers]);
};


const useErrors = (errors = []) => {
  useEffect(() => {
    errors.forEach(({ isError, error, fallback }) => {
      if (isError) {
        if (fallback) fallback();
        else toast.error(error?.data?.message || "Something went wrong");
      }
    });
  }, [errors]);
};





export const useInfiniteScrollTop = (
    containerRef,
    totalPages,
    page,
    setPage,
    newData,
    shouldReverse = false
  ) => {
    const [data, setData] = useState([]);
    // console.log(newData)
    const debounceTimer = useRef(null);
  
    const handleScroll = useCallback(() => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
  
      debounceTimer.current = setTimeout(() => {
        if (!containerRef.current) return;
  
        const { scrollTop ,scrollHeight,clientHeight} = containerRef.current;
        const scrolledToTop = scrollTop === 0;
        //console.log(scrollTop," ",scrollHeight," ",clientHeight)
        
        if (scrolledToTop) {
          if (totalPages === page) return;
          setPage((oldPage) => oldPage + 1);
        }
      }, 200);
    }, [totalPages, page]);
  
    useEffect(() => {
      const container = containerRef.current;
  
      if (container) container.addEventListener('scroll', handleScroll);
  
      return () => {
        if (container) container.removeEventListener('scroll', handleScroll);
      };
    }, [handleScroll, data]);
  
    useEffect(() => {
      let prevScrollHeight = 0;
      let prevScrollTop = 0;
  
      if (containerRef.current) {
        prevScrollHeight = containerRef.current.scrollHeight;
        prevScrollTop = containerRef.current.scrollTop;
      }
      if (newData) {
        setData((oldData) => {
          const seen = new Set(oldData.map((i) => i.id));
          
          const newMessages = newData.filter((i) => !seen.has(i.id));
  
          if (shouldReverse) {
            const newDataArray = Array.isArray(newMessages)
              ? [...newMessages]
              : [newMessages];
  
            return [...newDataArray.reverse(), ...oldData];
          } else {
            return [...newMessages, ...oldData];
          }
        });
      }
  
      requestAnimationFrame(() => {
        if (containerRef.current) {
          const newScrollTop =
            prevScrollTop + containerRef.current.scrollHeight - prevScrollHeight;
          containerRef.current.scrollTop = newScrollTop;
        }
      });
    }, [newData]);
  
    return { data, setData };
  };
  
  
  